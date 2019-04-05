import React, { Component } from 'react'
import AuthForm from './AuthForm'
import { withUser } from '../../context/UserProvider.js'
import './login.css'

class AuthContainer extends Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            authToggle: false
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

    toggler = () => {
        this.setState(prevState => ({
            authToggle: !prevState.authToggle
        }))
    }

    render() {
        return (
            <div id="auth-wrap">
                <div className="form-container">
                    {this.state.authToggle
                        ?
                        <div>
                            <h2>Sign up</h2>
                            <AuthForm
                                handleChange={this.handleChange}
                                handleSubmit={this.handleSignup}
                                username={this.state.username}
                                password={this.state.password}
                                btnText="Sign up"
                            />
                            <p className="error-message">{this.props.errMsg}</p>
                            <p onClick={this.toggler}>Are you already a member?</p>
                        </div>
                        :
                        <div>
                            <h2>Sign in</h2>
                            <AuthForm
                                handleChange={this.handleChange}
                                handleSubmit={this.handleLogin}
                                username={this.state.username}
                                password={this.state.password}
                                btnText="Login"
                            />
                            <p className="error-message">{this.props.errMsg}</p>
                            <p onClick={this.toggler}>Create an account</p>
                        </div>
                    }
                </div>
            </div>
        )
    }

}

export default withUser(AuthContainer)