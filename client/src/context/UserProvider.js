import React, { Component } from 'react'
import axios from 'axios'

const userAxios = axios.create()

// On every request, use the following middleware function
userAxios.interceptors.request.use((config) => {
    const token = localStorage.token
    config.headers.Authorization = `Bearer ${token}`
    return config // return header with user and token for Auth
})

const UserContext = React.createContext()

class UserProvider extends Component {
    constructor() {
        super()
        this.state = {
            user: JSON.parse(localStorage.getItem("user")) || {},
            token: localStorage.token || "",
            errMsg: "",
            updateMsg: ""
        }
    }

    updateUser = (_id, updates) => {
        userAxios.put(`/api/users/${_id}`, updates).then(response => {
            localStorage.setItem("user", JSON.stringify(response.data))
            this.setState({ user: response.data, errMsg: "", updateMsg: "Updated successfully!" })
        }).catch(err => this.setState({ updateMsg: "", errMsg: err.response.data.errMsg }))
    }

    signup = (credentials) => {
        axios.post("/auth/signup", credentials).then(response => {
            const { user, token } = response.data
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("token", token)
            this.setState({ user, token })
        }).catch(err => this.handleErr(err.response.data.errMsg))
    }

    login = (credentials) => {
        axios.post("/auth/login", credentials).then(response => {
            const { user, token } = response.data
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("token", token)
            this.setState({ user, token })
        }).catch(err => this.handleErr(err.response.data.errMsg))
    }

    logout = () => {
        // Clear up localStorage and State
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        this.setState({
            user: {},
            token: "",
            errMsg: "",
            updateMsg: ""
        })
    }

    clearUserMessages = () => {
        // Clear away messages
        this.setState({
            errMsg: "",
            updateMsg: ""
        })
    }

    handleErr = (errMsg) => { this.setState({ errMsg }) }

    render() {
        return (
            <UserContext.Provider
                value={{
                    ...this.state,
                    signup: this.signup,
                    login: this.login,
                    logout: this.logout,
                    updateUser: this.updateUser,
                    clearUserMessages: this.clearUserMessages
                }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default UserProvider

export const withUser = C => props => (
    <UserContext.Consumer>
        {value => <C {...props} {...value} />}
    </UserContext.Consumer>
)