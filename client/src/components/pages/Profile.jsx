import React from 'react'
import { withUser } from '../../context/UserProvider.jsx'
import EditProfileForm from '../EditProfileForm.jsx'
import { getDeck } from '../../decks.js'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.user.username,
            email: this.props.user.email || "",
            firstName: this.props.user.firstName || "",
            lastName: this.props.user.lastName || "",
            allowRev: this.props.user.allowRev,
            deck: getDeck(this.props.user.deck).id
        }
    }

    componentDidMount() {
        // The top-right deck button links to /profile#deck
        const section = window.location.hash && document.getElementById(window.location.hash.slice(1))
        if (section) section.scrollIntoView({ block: 'start' })
        else window.scrollTo(0, 0)
        this.props.clearUserMessages()
    }

    componentDidUpdate(prevProps) {
        const messageAppeared = (this.props.errMsg && !prevProps.errMsg) ||
                                (this.props.updateMsg && !prevProps.updateMsg)
        if (messageAppeared) {
            clearTimeout(this._msgTimer)
            this._msgTimer = setTimeout(() => this.props.clearUserMessages(), 5000)
        }
    }

    componentWillUnmount() {
        clearTimeout(this._msgTimer)
        // Don't lose an edit that's still waiting on the typing delay
        if (this._saveTimer) this.save()
    }

    // Changes save automatically: checkboxes and the deck picker straight away,
    // text fields once typing pauses or the field loses focus.
    handleChange = (e) => {
        const { name, type, checked, value } = e.target
        const instant = type === "checkbox" || type === "radio"
        this.setState({ [name]: type === "checkbox" ? checked : value }, () => {
            clearTimeout(this._saveTimer)
            if (instant) this.save()
            else this._saveTimer = setTimeout(this.save, 1000)
        })
    }

    handleBlur = () => {
        if (this._saveTimer) this.save({ report: true })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.save({ report: true })
    }

    save = ({ report = false } = {}) => {
        clearTimeout(this._saveTimer)
        this._saveTimer = null

        // Skip invalid input (e.g. an empty name or a half-typed email); show why only
        // when the user has left the field, not mid-typing.
        const form = document.getElementById("profile-form")
        if (form && !form.checkValidity()) {
            if (report) form.reportValidity()
            return
        }

        const { user } = this.props
        const unchanged = ["email", "firstName", "lastName", "allowRev", "deck"]
            .every(key => this.state[key] === (key === "deck" ? getDeck(user.deck).id : user[key] ?? ""))
        if (unchanged) return

        const UserUpdate = {
            username: this.state.username,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            allowRev: this.state.allowRev.toString(),
            deck: this.state.deck,
        }
        // Clear first so the message shows again (and its timer restarts) on every save
        this.props.clearUserMessages()
        this.props.updateUser(this.props.user._id, UserUpdate)
    }

    render() {
        return (
            <main id="page-wrap">
                <h2>Profile &amp; Preferences</h2>

                <div className="card purple-bg" id="add-form">
                    <EditProfileForm
                        handleChange={this.handleChange}
                        handleSubmit={this.handleSubmit}
                        handleBlur={this.handleBlur}
                        updateMsg={this.props.updateMsg}
                        errMsg={this.props.errMsg}
                        changePassword={this.props.changePassword}
                        clearUserMessages={this.props.clearUserMessages}
                        {...this.state}
                    />
                </div>
            </main>
        )
    }
}

export default withUser(Profile)