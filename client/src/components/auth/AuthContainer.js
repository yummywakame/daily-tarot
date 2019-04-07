import React, { Component } from 'react'
import AuthForm from './AuthForm'
import { withUser } from '../../context/UserProvider.js'
import { withToggler } from '../shared/Toggle.js'
import './login.css'

class AuthContainer extends Component {
    constructor() {
        super()
        this.state = {
            username: "",
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
            username: this.state.username,
            password: this.state.password
        }
        this.props.signup(credentials)
    }

    // handleSubmit for our login form
    handleLogin = (event) => {
        event.preventDefault()
        const credentials = {
            username: this.state.username,
            password: this.state.password
        }
        this.props.login(credentials)
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
                                username={this.state.username}
                                password={this.state.password}
                                btnText="Sign up"
                            />
                        
                            <p onClick={this.props.toggler}>Are you already a member?</p>
                        </div>
                        :
                        <div>
                            <h2>Sign in</h2>
                            
                            { this.props.errMsg && <p className="error-message">{this.props.errMsg}</p>}

                            <AuthForm
                                handleChange={this.handleChange}
                                handleSubmit={this.handleLogin}
                                username={this.state.username}
                                password={this.state.password}
                                btnText="Login"
                            />
                            
                            <p onClick={this.props.toggler}>Create an account</p>
                        </div>
                    }
                </div>
            </div>
        )
    }

}

export default withToggler(withUser(AuthContainer))