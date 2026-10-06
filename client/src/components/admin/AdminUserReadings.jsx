import React, { useEffect, useState } from 'react'
import adminAxios from '../../authAxios.js'
import { cardImage } from '../../decks.js'
import CardLightbox from '../shared/CardLightbox.jsx'
import AdminMessage, { errorText } from './AdminMessage.jsx'

// One user's readings, opened from the Users tab.
const AdminUserReadings = ({ user, onBack }) => {
    const [data, setData] = useState(null)
    const [page, setPage] = useState(1)
    const [msg, setMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [zoomedCard, setZoomedCard] = useState(null)

    const loadPage = (p) => {
        adminAxios.get(`api/admin/users/${user._id}/readings`, { params: { page: p, limit: 25 } })
            .then(res => setData(res.data))
            .catch(err => setErrMsg(errorText(err, 'Failed to load readings.')))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => { loadPage(page) }, [page])

    const deleteReading = (reading) => {
        if (!window.confirm(`Delete this ${reading.cards[0]?.name || ''} reading by ${user.email}?`)) return
        adminAxios.delete(`api/admin/readings/${reading._id}`)
            .then(() => {
                setMsg('Reading deleted.')
                setErrMsg('')
                // Step back a page if this emptied the last one
                if (data.readings.length === 1 && page > 1) setPage(page - 1)
                else loadPage(page)
            })
            .catch(err => { setMsg(''); setErrMsg(errorText(err, 'Failed to delete reading.')) })
    }

    return (
        <>
            <button type="button" className="secondary back-link" onClick={onBack}>
                <i className="fas fa-arrow-left"></i> All users
            </button>

            <h3 className="admin-user-heading">{user.email}</h3>

            <AdminMessage errMsg={errMsg} msg={msg} persist={!data} />

            {!data
                ? !errMsg && <p>Loading…</p>
                : <>
                    <p className="admin-count">{data.total} {data.total === 1 ? 'reading' : 'readings'}</p>

                    <ul className="admin-list">
                        {data.readings.map(reading => {
                            const card = reading.cards[0]
                            return (
                                <li key={reading._id} className="admin-row">
                                    {card &&
                                        <img
                                            className={`admin-thumb zoomable${card.isReversed ? " rev" : ""}`}
                                            src={cardImage(reading.deck, card.name_short)}
                                            alt={card.name}
                                            onClick={() => setZoomedCard({ ...card, deck: reading.deck })} />
                                    }
                                    <div className="admin-row-main">
                                        <strong>{card ? `${card.name}${card.isReversed ? ' (Reversed)' : ''}` : 'No card'}</strong>
                                        <div className="admin-meta">
                                            <span>{new Date(reading.timeStamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                        </div>
                                        {reading.notes && <p className="admin-notes">{reading.notes}</p>}
                                    </div>
                                    <div className="admin-actions">
                                        <button className="danger" onClick={() => deleteReading(reading)}>Delete</button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>

                    {data.pages > 1 &&
                        <div className="admin-pager">
                            <button className="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                            <span>Page {data.page} of {data.pages}</span>
                            <button className="secondary" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
                        </div>
                    }
                </>
            }

            {zoomedCard &&
                <CardLightbox
                    src={cardImage(zoomedCard.deck, zoomedCard.name_short)}
                    alt={`${zoomedCard.name}${zoomedCard.isReversed ? " (Reversed)" : ""}`}
                    isReversed={zoomedCard.isReversed}
                    onClose={() => setZoomedCard(null)}
                />
            }
        </>
    )
}

export default AdminUserReadings
