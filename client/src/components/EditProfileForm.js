import React from 'react'

const EditProfileForm = props => {
    const { handleSubmit, handleChange, email, firstName, lastName, allowRev, updateMsg } = props
    return (
        <form onSubmit={handleSubmit} id="profile-form">

            {updateMsg && <p className="response-message">{updateMsg}</p>}

            <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                placeholder="First Name"
                required />
            <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required />

            <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email Address"
            />

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

            <button>Save</button>
        </form>
    )
}

export default EditProfileForm