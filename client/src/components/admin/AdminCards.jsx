import React, { useEffect, useState } from 'react'
import adminAxios from '../../authAxios.js'
import { DECKS, cardImage } from '../../decks.js'
import { useUser } from '../../context/UserProvider.jsx'
import AdminMessage, { errorText } from './AdminMessage.jsx'
import CardLightbox from '../shared/CardLightbox.jsx'

// Default (Biddy Tarot) text lives on the shared Card; element/astrology are shared by every deck.
const EDITABLE = ['name', 'element', 'astrology', 'meaning_up', 'meaning_rev', 'meaning_up_long', 'meaning_rev_long', 'desc']
// Fields a deck can give its own text (keep in sync with models/DeckCard.js)
const DECK_EDITABLE = ['name', 'meaning_up', 'meaning_rev', 'meaning_up_long', 'meaning_rev_long', 'desc']
const ELEMENTS = ['Air', 'Fire', 'Earth', 'Water']
// Value of the "Content for" picker when editing the default text
const DEFAULT_TEXT = ''

const AdminCards = () => {
    const { deck: ownDeck } = useUser().user
    const [cards, setCards] = useState(null)
    const [source, setSource] = useState(DEFAULT_TEXT)
    // { useDefaultContent, custom: { [cardId]: DeckCard } } for the picked deck
    const [deckData, setDeckData] = useState(null)
    const [filter, setFilter] = useState('')
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(null)
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [isZoomed, setIsZoomed] = useState(false)

    const isDeck = source !== DEFAULT_TEXT
    const imageDeck = isDeck ? source : ownDeck
    const fields = isDeck ? DECK_EDITABLE : EDITABLE
    const customFor = card => isDeck && deckData ? deckData.custom[card._id] : null

    // Form values: the deck's own text where saved, else the default text
    const pick = (card) => Object.fromEntries(fields.map(k => [k, customFor(card)?.[k] || card[k] || '']))

    useEffect(() => {
        adminAxios.get('api/cards')
            .then(res => setCards(res.data.sort((a, b) => a.value_int - b.value_int)))
            .catch(err => setErrMsg(errorText(err, 'Failed to load cards.')))
    }, [])

    useEffect(() => {
        setDeckData(null)
        if (!isDeck) return
        adminAxios.get(`api/admin/decks/${source}`)
            .then(res => setDeckData({
                useDefaultContent: res.data.useDefaultContent,
                custom: Object.fromEntries(res.data.cards.map(c => [c.card, c]))
            }))
            .catch(err => setErrMsg(errorText(err, 'Failed to load deck.')))
    }, [source])

    const isDirty = selected && form && fields.some(k => form[k] !== pick(selected)[k])

    const selectCard = (card) => {
        if (isDirty && !window.confirm('Discard your unsaved changes?')) return
        setSelected(card)
        setForm(card ? pick(card) : null)
        setMsg('')
        setErrMsg('')
        window.scrollTo(0, 0)
    }

    const toggleDefaultContent = (e) => {
        const useDefaultContent = e.target.checked
        adminAxios.put(`api/admin/decks/${source}`, { useDefaultContent })
            .then(res => {
                setDeckData({ ...deckData, useDefaultContent: res.data.useDefaultContent })
                setMsg(res.data.useDefaultContent ? 'This deck now uses the Biddy Tarot meanings.' : 'This deck now uses its own card text.')
                setErrMsg('')
            })
            .catch(err => { setMsg(''); setErrMsg(errorText(err, 'Failed to update deck.')) })
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const saveDefaultText = () => {
        // Only send fields that changed; empty element is left unset
        const updates = Object.fromEntries(EDITABLE
            .filter(k => form[k] !== (selected[k] ?? ''))
            .filter(k => !(k === 'element' && form[k] === ''))
            .map(k => [k, form[k]]))
        return adminAxios.put(`api/admin/cards/${selected._id}`, updates)
            .then(res => {
                setCards(cards.map(c => c._id === res.data._id ? res.data : c))
                setSelected(res.data)
                setForm(Object.fromEntries(EDITABLE.map(k => [k, res.data[k] ?? ''])))
                setMsg(`${res.data.name} saved.`)
            })
    }

    const saveDeckText = () => adminAxios.put(`api/admin/decks/${source}/cards/${selected._id}`, form)
        .then(res => {
            setDeckData({ ...deckData, custom: { ...deckData.custom, [selected._id]: res.data } })
            setMsg(`${res.data.name} saved for ${deckName}.`)
        })

    const handleSubmit = (e) => {
        e.preventDefault()
        setSaving(true)
        const save = isDeck ? saveDeckText : saveDefaultText
        save()
            .then(() => setErrMsg(''))
            .catch(err => { setMsg(''); setErrMsg(errorText(err, 'Failed to save card.')) })
            .finally(() => setSaving(false))
    }

    const removeDeckText = () => {
        if (!window.confirm(`Remove ${deckName}'s own text for ${selected.name}? It will use the Biddy Tarot text instead.`)) return
        adminAxios.delete(`api/admin/decks/${source}/cards/${selected._id}`)
            .then(() => {
                const { [selected._id]: removed, ...custom } = deckData.custom
                setDeckData({ ...deckData, custom })
                setForm(Object.fromEntries(DECK_EDITABLE.map(k => [k, selected[k] || ''])))
                setMsg('Custom text removed.')
                setErrMsg('')
            })
            .catch(err => { setMsg(''); setErrMsg(errorText(err, 'Failed to remove custom text.')) })
    }

    const deckName = DECKS.find(d => d.id === source)?.name

    if (!cards || (isDeck && !deckData)) return errMsg ? <AdminMessage errMsg={errMsg} persist /> : <p>Loading…</p>

    if (selected) {
        const hasCustom = Boolean(customFor(selected))
        return (
            <form className="admin-card-form" onSubmit={handleSubmit}>
                <button type="button" className="secondary back-link" onClick={() => selectCard(null)}>
                    <i className="fas fa-arrow-left"></i> All cards
                </button>

                <div className="admin-card-head">
                    <img className="zoomable" src={cardImage(imageDeck, selected.name_short)} alt={selected.name} onClick={() => setIsZoomed(true)} />
                    <div>
                        <h2>{form.name || selected.name}</h2>
                        <p className="admin-meta">
                            <span>{isDeck ? deckName : 'Biddy Tarot (default text)'}</span>
                            <span>{selected.type}{selected.suit ? ` · ${selected.suit}` : ''}</span>
                            <span>{selected.value}</span>
                        </p>
                    </div>
                </div>

                <AdminMessage errMsg={errMsg} msg={msg} />

                {isDeck && deckData.useDefaultContent &&
                    <p className="admin-hint admin-notice">
                        {deckName} is set to use the Biddy Tarot meanings, so users won't see this text yet. It's kept, and shows once you untick “Use Biddy Tarot meanings”.
                    </p>
                }
                {isDeck && !hasCustom &&
                    <p className="admin-hint">No text saved for this card in {deckName} yet; showing the Biddy Tarot text to start from.</p>
                }

                <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
                {!isDeck &&
                    <div className="admin-field-row">
                        <label>Element
                            <select name="element" value={form.element} onChange={handleChange}>
                                <option value="">—</option>
                                {ELEMENTS.map(el => <option key={el} value={el}>{el}</option>)}
                            </select>
                        </label>
                        <label>Astrology<input name="astrology" value={form.astrology} onChange={handleChange} /></label>
                    </div>
                }
                <label>Upright keywords<input name="meaning_up" value={form.meaning_up} onChange={handleChange} /></label>
                <label>Reversed keywords<input name="meaning_rev" value={form.meaning_rev} onChange={handleChange} /></label>

                <p className="admin-hint">The fields below are shown as HTML. Wrap paragraphs in &lt;p&gt;…&lt;/p&gt;.</p>
                <label>Upright meaning<textarea name="meaning_up_long" rows="10" value={form.meaning_up_long} onChange={handleChange} required /></label>
                <label>Reversed meaning<textarea name="meaning_rev_long" rows="10" value={form.meaning_rev_long} onChange={handleChange} required /></label>
                <label>Card description<textarea name="desc" rows="10" value={form.desc} onChange={handleChange} required /></label>

                <div className="admin-actions">
                    {isDeck && hasCustom &&
                        <button type="button" className="danger" disabled={saving} onClick={removeDeckText}>Remove custom text</button>
                    }
                    <button type="button" className="secondary" disabled={!isDirty || saving} onClick={() => setForm(pick(selected))}>Reset</button>
                    <button type="submit" disabled={!isDirty || saving}>{saving ? 'Saving…' : 'Save card'}</button>
                </div>

                {isZoomed &&
                    <CardLightbox
                        src={cardImage(imageDeck, selected.name_short)}
                        alt={selected.name}
                        onClose={() => setIsZoomed(false)}
                    />
                }
            </form>
        )
    }

    const q = filter.trim().toLowerCase()
    const shown = q ? cards.filter(c => c.name.toLowerCase().includes(q) || (c.suit || '').includes(q)) : cards

    return (
        <>
            <AdminMessage errMsg={errMsg} msg={msg} />

            <div className="admin-deck-bar">
                <label>Content for
                    <select value={source} onChange={e => { setMsg(''); setErrMsg(''); setSource(e.target.value) }}>
                        <option value={DEFAULT_TEXT}>Biddy Tarot (default text)</option>
                        {DECKS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </label>
                {isDeck &&
                    <label className="admin-checkbox">
                        <input type="checkbox" checked={deckData.useDefaultContent} onChange={toggleDefaultContent} />
                        Use Biddy Tarot meanings
                    </label>
                }
            </div>
            <p className="admin-hint admin-deck-hint">
                {isDeck
                    ? deckData.useDefaultContent
                        ? `${deckName} shows the Biddy Tarot text. Any text saved for its cards is kept but not shown until you untick the box.`
                        : `${deckName} shows its own text where saved, and the Biddy Tarot text for every other card.`
                    : 'The default text, used by every deck set to “Use Biddy Tarot meanings” and for cards a deck has no text for. Element and astrology apply to all decks.'}
            </p>

            <input type="search" className="admin-search" placeholder="Filter cards by name or suit" value={filter} onChange={e => setFilter(e.target.value)} />
            <ul className="admin-card-grid">
                {shown.map(card =>
                    <li key={card._id}>
                        <button type="button" onClick={() => selectCard(card)} title={`Edit ${card.name}`}>
                            <img src={cardImage(imageDeck, card.name_short)} alt="" loading="lazy" />
                            <span>{customFor(card)?.name || card.name}</span>
                            {customFor(card) && <span className="badge">Custom</span>}
                        </button>
                    </li>
                )}
            </ul>
            {!shown.length && <p>No cards match “{filter}”.</p>}
        </>
    )
}

export default AdminCards
