import React, { Component } from 'react'

class NotFound extends Component {
    
    render() {
        return (
            <main id="page-wrap">
                <h2>The Page You Are Looking For Does Not Exist</h2>
                <p>Would you like to see your <span className="blue" onClick={() => this.props.history.push(`/today`)}>tarot card for today</span>?</p>

            </main>
        )
    }
}

export default NotFound