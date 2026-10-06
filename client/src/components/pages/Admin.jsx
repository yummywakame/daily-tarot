import React, { useEffect, useState } from 'react'
import AdminOverview from '../admin/AdminOverview.jsx'
import AdminUsers from '../admin/AdminUsers.jsx'
import AdminReadings from '../admin/AdminReadings.jsx'
import AdminCards from '../admin/AdminCards.jsx'
import '../../styles/admin.css'

const TABS = [
    { id: 'overview', label: 'Overview', Component: AdminOverview },
    { id: 'users', label: 'Users', Component: AdminUsers },
    { id: 'readings', label: 'Readings', Component: AdminReadings },
    { id: 'cards', label: 'Cards', Component: AdminCards }
]

const Admin = ({ user }) => {
    const [tab, setTab] = useState('overview')

    useEffect(() => { window.scrollTo(0, 0) }, [])

    const { Component } = TABS.find(t => t.id === tab)

    return (
        <main id="page-wrap" className="admin-page">
            <h2>Admin</h2>

            <div id="tabs" role="tablist">
                {TABS.map(t =>
                    <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "selected" : ""} onClick={() => setTab(t.id)}>
                        {t.label}
                    </button>
                )}
            </div>

            <div className="card purple-bg admin-panel">
                <Component currentUser={user} />
            </div>
        </main>
    )
}

export default Admin
