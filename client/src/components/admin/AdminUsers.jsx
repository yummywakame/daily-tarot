import React, { useEffect, useState } from 'react'
import adminAxios from '../../authAxios.js'
import AdminMessage, { errorText } from './AdminMessage.jsx'

const AdminUsers = ({ currentUser }) => {
    const [users, setUsers] = useState(null)
    const [msg, setMsg] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [busyId, setBusyId] = useState(null)

    const loadUsers = () => {
        adminAxios.get('api/admin/users')
            .then(res => setUsers(res.data))
            .catch(err => setErrMsg(errorText(err, 'Failed to load users.')))
    }

    useEffect(loadUsers, [])

    const report = (message, isError) => {
        setMsg(isError ? '' : message)
        setErrMsg(isError ? message : '')
    }

    const toggleAdmin = (user) => {
        const isAdmin = !user.isAdmin
        if (!window.confirm(`${isAdmin ? 'Make' : 'Remove'} ${user.email} ${isAdmin ? 'an admin' : 'as admin'}?`)) return
        setBusyId(user._id)
        adminAxios.patch(`api/admin/users/${user._id}/role`, { isAdmin })
            .then(() => {
                setUsers(users.map(u => u._id === user._id ? { ...u, isAdmin } : u))
                report(`${user.email} is ${isAdmin ? 'now an admin' : 'no longer an admin'}.`)
            })
            .catch(err => report(errorText(err, 'Failed to update user.'), true))
            .finally(() => setBusyId(null))
    }

    const deleteUser = (user) => {
        if (!window.confirm(`Permanently delete ${user.email} and their ${user.readingCount} reading(s)? This cannot be undone.`)) return
        setBusyId(user._id)
        adminAxios.delete(`api/admin/users/${user._id}`)
            .then(res => {
                setUsers(users.filter(u => u._id !== user._id))
                report(res.data.message)
            })
            .catch(err => report(errorText(err, 'Failed to delete user.'), true))
            .finally(() => setBusyId(null))
    }

    if (!users) return errMsg ? <AdminMessage errMsg={errMsg} /> : <p>Loading…</p>

    return (
        <>
            <AdminMessage errMsg={errMsg} msg={msg} />
            <p className="admin-count">{users.length} {users.length === 1 ? 'user' : 'users'}</p>

            <ul className="admin-list">
                {users.map(user => {
                    const isSelf = user._id === currentUser._id
                    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
                    return (
                        <li key={user._id} className="admin-row">
                            <div className="admin-row-main">
                                <strong>{user.email}</strong>
                                {user.isAdmin && <span className="badge">Admin</span>}
                                {isSelf && <span className="badge muted">You</span>}
                                <div className="admin-meta">
                                    {fullName && <span>{fullName}</span>}
                                    <span>{user.readingCount} {user.readingCount === 1 ? 'reading' : 'readings'}</span>
                                    <span>Last reading: {user.lastReading ? new Date(user.lastReading).toLocaleDateString() : '—'}</span>
                                </div>
                            </div>
                            {!isSelf &&
                                <div className="admin-actions">
                                    <button className="secondary" disabled={busyId === user._id} onClick={() => toggleAdmin(user)}>
                                        {user.isAdmin ? 'Remove admin' : 'Make admin'}
                                    </button>
                                    <button className="danger" disabled={busyId === user._id} onClick={() => deleteUser(user)}>Delete</button>
                                </div>
                            }
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default AdminUsers
