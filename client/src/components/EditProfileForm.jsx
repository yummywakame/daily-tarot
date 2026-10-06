import React from 'react'
import { createPortal } from 'react-dom'
import { DECKS, cardImage, cardBack } from '../decks.js'
import PasswordFields from './PasswordFields.jsx'

const EditProfileForm = props => {
    const { handleSubmit, handleChange, handleBlur, email, firstName, lastName, allowRev, deck, updateMsg, errMsg, changePassword, clearUserMessages } = props
    return (
        <form onSubmit={handleSubmit} id="profile-form">

            {/* Shown as a toast so the form doesn't jump while it autosaves */}
            {createPortal(
                <div className="profile-toast" role="status" aria-live="polite">
                    {errMsg && <p key={errMsg} className="error-message">{errMsg}</p>}
                    {updateMsg && <p key={updateMsg} className="response-message">{updateMsg}</p>}
                </div>,
                document.body
            )}

            <h3>Profile</h3>

            <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email Address"
            />

            <div className="field-row">
                <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="First Name"
                    required />
                <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Last Name"
                    required />
            </div>

            <PasswordFields email={email} changePassword={changePassword} clearUserMessages={clearUserMessages} />

            <div className="selections">

                <div>
                    <input
                        type="checkbox"
                        name="allowRev"
                        checked={allowRev}
                        onChange={handleChange} />
                    <label>Allow Reversed Cards</label>
                </div>

            </div>

            <fieldset className="deck-picker" id="deck">
                <legend><h3>Tarot Deck</h3></legend>
                {DECKS.map(d => (
                    <label key={d.id} className={d.id === deck ? "deck-option selected" : "deck-option"}>
                        <input
                            type="radio"
                            name="deck"
                            value={d.id}
                            checked={d.id === deck}
                            onChange={handleChange} />
                        <span className="deck-thumbs">
                            <img src={cardBack(d.id)} alt="" loading="lazy" />
                            <img src={cardImage(d.id, 'ar17')} alt="" loading="lazy" />
                        </span>
                        <span className="deck-name">{d.name}</span>
                        {d.artist && <span className="deck-artist">{d.artist}</span>}
                    </label>
                ))}
            </fieldset>

            <p className="autosave-note">Changes are saved automatically.</p>
        </form>
    )
}

export default EditProfileForm