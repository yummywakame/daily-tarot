import React from 'react'
import { withUser } from '../../context/UserProvider.js'
import EditProfileForm from '../EditProfileForm.js'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.user.username,
            email: this.props.user.email || "",
            password: this.props.user.password,
            firstName: this.props.user.firstName || "",
            lastName: this.props.user.lastName || "",
            isAdmin: this.props.user.isAdmin,
            allowRev: this.props.user.allowRev
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.props.clearUserMessages()
    }

    handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const UserUpdate = {
            username: this.state.username,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
            isAdmin: this.state.isAdmin.toString(),
            allowRev: this.state.allowRev.toString(),
        }
        this.props.updateUser(this.props.user._id, UserUpdate)
    }

    render() {
        return (
            <main id="page-wrap">
                <h2>Profile &amp; Preferences</h2>

                <div className="card" id="add-form">
                    <EditProfileForm
                        handleChange={this.handleChange}
                        handleSubmit={this.handleSubmit}
                        updateMsg={this.props.updateMsg}
                        {...this.state}
                    />
                </div>
            </main>
        )
    }
}

export default withUser(Profile)