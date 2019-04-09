import React from 'react'

const NotesForm = props => {
    const { handleSubmit, handleChange, notes, readingMsg } = props
    
    return (
        <form onSubmit={handleSubmit} id="profile-form">
            { readingMsg && <p className="response-message">{readingMsg}</p>}
            <textarea
                name="notes"
                value={notes}
                placeholder="Notes..."
                onChange={handleChange}
                rows="8"
                data-gramm_editor="false" // grammarly causes textarea to jump on focus
                required />

            <button>Save</button>
        </form>
    )
}

export default NotesForm