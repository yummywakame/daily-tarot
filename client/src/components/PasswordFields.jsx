import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const EMPTY = { newPassword: '', confirmPassword: '' }

// Sits among the autosaving profile fields, but the inputs belong to their own form
// (via the `form` attribute) so a password only changes when its button is clicked,
// and half-typed passwords don't stop the profile from autosaving.
// Messages show in the Profile page's toast via UserProvider.
const PasswordFields = ({ email, changePassword, clearUserMessages }) => {
    const [inputs, setInputs] = useState(EMPTY)
    const [saving, setSaving] = useState(false)

    const handleChange = (e) => {
        const next = { ...inputs, [e.target.name]: e.target.value }
        setInputs(next)
        e.target.form.elements.confirmPassword.setCustomValidity(
            next.confirmPassword && next.confirmPassword !== next.newPassword ? 'Passwords do not match.' : '')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSaving(true)
        clearUserMessages()
        changePassword(inputs.newPassword)
            .then(ok => { if (ok) setInputs(EMPTY) })
            .finally(() => setSaving(false))
    }

    return (
        <>
            {/* Forms can't nest, so the form itself lives outside the profile form */}
            {createPortal(
                <form id="password-form" onSubmit={handleSubmit} hidden>
                    {/* Lets password managers know which account this is for */}
                    <input type="email" name="username" value={email || ''} autoComplete="username" readOnly />
                </form>,
                document.body
            )}

            <div className="field-row">
                <input
                    type="password"
                    name="newPassword"
                    form="password-form"
                    value={inputs.newPassword}
                    onChange={handleChange}
                    placeholder="New Password"
                    title="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required />
                <input
                    type="password"
                    name="confirmPassword"
                    form="password-form"
                    value={inputs.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm New Password"
                    autoComplete="new-password"
                    required />
            </div>
            {(inputs.newPassword || inputs.confirmPassword) &&
                <button type="submit" form="password-form" disabled={saving}>{saving ? 'Saving…' : 'Change Password'}</button>
            }
        </>
    )
}

export default PasswordFields
