import React from 'react'

// Error / success line shared by the admin tabs. `key` replays the fade animation for repeat messages.
const AdminMessage = ({ errMsg, msg }) => (
    <>
        {errMsg && <p key={`e-${errMsg}`} className="admin-msg error">{errMsg}</p>}
        {msg && <p key={`m-${msg}`} className="admin-msg success">{msg}</p>}
    </>
)

export const errorText = (err, fallback) => err.response?.data?.errMsg || fallback

export default AdminMessage
