import React from 'react'

const AuthForm = (props) => {
    const { handleSubmit, handleChange, btnText, username, password, email, isToggled } = props

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="username" 
                onChange={handleChange} 
                value={username} 
                placeholder="Username" 
                required />
            {isToggled && 
            <input 
                type="text" 
                name="email" 
                onChange={handleChange} 
                value={email} 
                placeholder="Email" 
                required /> 
            }
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