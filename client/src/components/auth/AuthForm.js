import React from 'react'

const AuthForm = (props) => {
    const { handleSubmit, handleChange, btnText, email, password } = props

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                onChange={handleChange}
                value={email}
                placeholder="Email address"
                required />
            <input
                type="password"
                name="password"
                onChange={handleChange}
                value={password}
                placeholder="Password"
                required />
            <button>{ (btnText === "Login") ? <i className="fas fa-sign-in-alt"></i> : <i className="fas fa-user-plus"></i> }</button>
        </form>
    )
}

export default AuthForm
