import React, { useEffect, useState } from 'react'
import adminAxios from '../../authAxios.js'
import { publicUrl } from '../../publicUrl.js'
import AdminMessage, { errorText } from './AdminMessage.jsx'

const AdminOverview = () => {
    const [stats, setStats] = useState(null)
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        adminAxios.get('api/admin/stats')
            .then(res => setStats(res.data))
            .catch(err => setErrMsg(errorText(err, 'Failed to load stats.')))
    }, [])

    if (errMsg) return <AdminMessage errMsg={errMsg} persist />
    if (!stats) return <p>Loading…</p>

    const tiles = [
        { label: 'Users', value: stats.users },
        { label: 'Admins', value: stats.admins },
        { label: 'Readings', value: stats.readings },
        { label: 'Readings, last 7 days', value: stats.readingsLastWeek }
    ]

    return (
        <>
            <div className="stat-tiles">
                {tiles.map(t =>
                    <div className="stat-tile" key={t.label}>
                        <span className="stat-value gold">{t.value}</span>
                        <span className="stat-label">{t.label}</span>
                    </div>
                )}
            </div>

            <h4>Most drawn cards</h4>
            {stats.topCards.length
                ?
                <ol className="top-cards">
                    {stats.topCards.map(c =>
                        <li key={c.name_short}>
                            <img src={publicUrl(`decks/prisma-visions/${c.name_short}.jpg`)} alt={c.name} />
                            <span>{c.name}</span>
                            <span className="blue">{c.count} {c.count === 1 ? 'draw' : 'draws'}</span>
                        </li>
                    )}
                </ol>
                :
                <p>No readings yet.</p>
            }
        </>
    )
}

export default AdminOverview
