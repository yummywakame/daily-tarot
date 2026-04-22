import React, { Component } from 'react'
import AuthForm from './AuthForm'
import { withUser } from '../../context/UserProvider.jsx'
import { withToggler } from '../shared/Toggle.jsx'
import '../../styles/formstyles.css'

class AuthContainer extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: ""
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    // handleSubmit for our signup form
    handleSignup = (event) => {
        event.preventDefault()
        const credentials = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.signup(credentials)
    }

    // handleSubmit for our login form
    handleLogin = (event) => {
        event.preventDefault()
        const credentials = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.login(credentials)
    }
    
    handleToggle = () => {
        this.props.clearUserMessages()
        this.props.toggler()
    }

    render() {
        return (
            <div id="auth-wrap">
                <div className="form-container">
                    {this.props.isToggled
                        ?
                        <div>
                            <h2>Sign up</h2>
                            
                            { this.props.errMsg && <p className="error-message">{this.props.errMsg}</p>}
                            
                            <AuthForm
                                handleChange={this.handleChange}
                                handleSubmit={this.handleSignup}
                                email={this.state.email}
                                password={this.state.password}
                                btnText="Sign up"
                            />
                        
                            <p onClick={this.handleToggle}>Are you already a member?</p>
                        </div>
                        :
                        <div>
                            <h2>Sign in</h2>
                            
                            { this.props.errMsg && <p className="error-message">{this.props.errMsg}</p>}

                            <AuthForm
                                handleChange={this.handleChange}
                                handleSubmit={this.handleLogin}
                                email={this.state.email}
                                password={this.state.password}
                                btnText="Login"
                            />
                            
                            <p onClick={this.handleToggle}>Create an account</p>
                        </div>
                    }
                </div>
            </div>
        )
    }

}

export default withToggler(withUser(AuthContainer))