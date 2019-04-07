import React from 'react'

const NotesForm = props => {
    const { handleSubmit, handleChange, notes } = props
    return (
        <form onSubmit={handleSubmit} id="profile-form">

            <textarea
                type="text"
                name="notes"
                value={notes}
                placeholder="Notes..."
                onChange={handleChange}
            />

            <button>Save</button>
        </form>
    )
}

export default NotesForm