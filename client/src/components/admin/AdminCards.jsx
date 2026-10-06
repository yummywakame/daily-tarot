import React, { useEffect, useState } from 'react'
import adminAxios from '../../authAxios.js'
import { publicUrl } from '../../publicUrl.js'
import AdminMessage, { errorText } from './AdminMessage.jsx'

const EDITABLE = ['name', 'element', 'astrology', 'meaning_up', 'meaning_rev', 'meaning_up_long', 'meaning_rev_long', 'desc']
const ELEMENTS = ['Air', 'Fire', 'Earth', 'Water']

const pick = (card) => Object.fromEntries(EDITABLE.map(k => [k, card[k] ?? '']))

const AdminCards = () => {
    const [cards, setCards] = useState(null)
    const [filter, setFilter] = useState('')
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState(null)
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        adminAxios.get('api/cards')
            .then(res => setCards(res.data.sort((a, b) => a.value_int - b.value_int)))
            .catch(err => setErrMsg(errorText(err, 'Failed to load cards.')))
    }, [])

    const isDirty = selected && form && EDITABLE.some(k => form[k] !== (selected[k] ?? ''))

    const selectCard = (card) => {
        if (isDirty && !window.confirm('Discard your unsaved changes?')) return
        setSelected(card)
        setForm(card ? pick(card) : null)
        setMsg('')
        setErrMsg('')
        window.scrollTo(0, 0)
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Only send fields that changed; empty element is left unset
        const updates = Object.fromEntries(EDITABLE
            .filter(k => form[k] !== (selected[k] ?? ''))
            .filter(k => !(k === 'element' && form[k] === ''))
            .map(k => [k, form[k]]))
        setSaving(true)
        adminAxios.put(`api/admin/cards/${selected._id}`, updates)
            .then(res => {
                setCards(cards.map(c => c._id === res.data._id ? res.data : c))
                setSelected(res.data)
                setForm(pick(res.data))
                setMsg(`${res.data.name} saved.`)
                setErrMsg('')
            })
            .catch(err => { setMsg(''); setErrMsg(errorText(err, 'Failed to save card.')) })
            .finally(() => setSaving(false))
    }

    if (!cards) return errMsg ? <AdminMessage errMsg={errMsg} /> : <p>Loading…</p>

    if (selected) {
        return (
            <form className="admin-card-form" onSubmit={handleSubmit}>
                <button type="button" className="secondary back-link" onClick={() => selectCard(null)}>
                    <i className="fas fa-arrow-left"></i> All cards
                </button>

                <div className="admin-card-head">
                    <img src={publicUrl(`decks/prisma-visions/${selected.name_short}.jpg`)} alt={selected.name} />
                    <div>
                        <h2>{selected.name}</h2>
                        <p className="admin-meta"><span>{selected.type}{selected.suit ? ` · ${selected.suit}` : ''}</span><span>{selected.value}</span></p>
                    </div>
                </div>

                <AdminMessage errMsg={errMsg} msg={msg} />

                <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
                <div className="admin-field-row">
                    <label>Element
                        <select name="element" value={form.element} onChange={handleChange}>
                            <option value="">—</option>
                            {ELEMENTS.map(el => <option key={el} value={el}>{el}</option>)}
                        </select>
                    </label>
                    <label>Astrology<input name="astrology" value={form.astrology} onChange={handleChange} /></label>
                </div>
                <label>Upright keywords<input name="meaning_up" value={form.meaning_up} onChange={handleChange} /></label>
                <label>Reversed keywords<input name="meaning_rev" value={form.meaning_rev} onChange={handleChange} /></label>

                <p className="admin-hint">The fields below are shown as HTML. Wrap paragraphs in &lt;p&gt;…&lt;/p&gt;.</p>
                <label>Upright meaning<textarea name="meaning_up_long" rows="10" value={form.meaning_up_long} onChange={handleChange} required /></label>
                <label>Reversed meaning<textarea name="meaning_rev_long" rows="10" value={form.meaning_rev_long} onChange={handleChange} required /></label>
                <label>Card description<textarea name="desc" rows="10" value={form.desc} onChange={handleChange} required /></label>

                <div className="admin-actions">
                    <button type="button" className="secondary" disabled={!isDirty || saving} onClick={() => setForm(pick(selected))}>Reset</button>
                    <button type="submit" disabled={!isDirty || saving}>{saving ? 'Saving…' : 'Save card'}</button>
                </div>
            </form>
        )
    }

    const q = filter.trim().toLowerCase()
    const shown = q ? cards.filter(c => c.name.toLowerCase().includes(q) || (c.suit || '').includes(q)) : cards

    return (
        <>
            <AdminMessage errMsg={errMsg} msg={msg} />
            <input type="search" className="admin-search" placeholder="Filter cards by name or suit" value={filter} onChange={e => setFilter(e.target.value)} />
            <ul className="admin-card-grid">
                {shown.map(card =>
                    <li key={card._id}>
                        <button type="button" onClick={() => selectCard(card)} title={`Edit ${card.name}`}>
                            <img src={publicUrl(`decks/prisma-visions/${card.name_short}.jpg`)} alt="" loading="lazy" />
                            <span>{card.name}</span>
                        </button>
                    </li>
                )}
            </ul>
            {!shown.length && <p>No cards match “{filter}”.</p>}
        </>
    )
}

export default AdminCards
