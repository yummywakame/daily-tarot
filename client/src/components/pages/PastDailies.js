import React, { Component } from 'react'
import { withUser } from '../../context/UserProvider.js'
import { withReading } from '../../context/ReadingProvider.js'

class PastDailies extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // Clear form messages
        this.props.clearReadingMessages()

        // Get All User's Readings
        this.props.getAllUsersReadings(this.props.user._id)
    }

    onDeleteHandle = () => {
        this.props.deleteAllUsersReadings(this.props.user._id)
    }

    render() {

        return (
            <main id="page-wrap">
                <h2>Past Daily Readings</h2>
                {this.props.pastReadings.length
                    ?
                    <>
                        <div id="card-history" className="cols-2">
                            {this.props.pastReadings.map((item, key) =>
                                <div className="card flex-grid purple-bg" key={key}>
                                    <div className="col">
                                        <img className={item.cards[0].isReversed ? "rev" : ""} src={`/decks/prisma-visions/${item.cards[0].name_short}.jpg`} alt={`${item.cards[0].name}`} />
                                    </div>
                                    <div className="col align-top">
                                        <p>{new Date(item.timeStamp).toDateString()}<br />{new Date(item.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <h2 className="">{item.cards[0].name} {item.cards[0].isReversed && " (Reversed)"}</h2>
                                        <h4 className="blue">{item.cards[0].meaning}</h4>
                                        <p className="left-align history_notes"><strong className="gold">{item.notes && `Notes:`} </strong>{item.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onClick={() => this.onDeleteHandle()}>Clear History</button>
                    </>
                    :
                    <>
                        <p>You have no available history yet.</p>
                        <p>Would you like to see your <span className="blue" onClick={() => this.props.history.push(`/today`)}>tarot card for today</span>?</p>
                    </>
                }

            </main>
        )
    }
}

export default withUser(withReading(PastDailies))