import React from 'react'

// Error / success line shared by the admin tabs. `key` replays the fade animation for repeat messages.
// `persist` keeps the error on screen — for failures that leave nothing else to show.
const AdminMessage = ({ errMsg, msg, persist }) => (
    <>
        {errMsg && <p key={`e-${errMsg}`} className={`admin-msg error${persist ? ' persist' : ''}`}>{errMsg}</p>}
        {msg && <p key={`m-${msg}`} className="admin-msg success">{msg}</p>}
    </>
)

export const errorText = (err, fallback) => err.response?.data?.errMsg || fallback

export default AdminMessage
