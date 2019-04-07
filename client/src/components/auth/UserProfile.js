import React from 'react'

class UserProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            isAdmin: false,
            allowRev: false
        }
    }

    render(props) {
        return (
            <>
            </>
        )
    }
}

export default UserProfile