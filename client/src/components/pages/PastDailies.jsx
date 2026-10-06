import React, { Component } from 'react'
import { withUser } from '../../context/UserProvider.jsx'
import { withReading } from '../../context/ReadingProvider.jsx'
import withNavigate from '../../shared/withNavigate.jsx'
import { publicUrl } from '../../publicUrl.js'
import CardLightbox from '../shared/CardLightbox.jsx'

class PastDailies extends Component {
    constructor(props) {
        super(props)
        this.state = {
            zoomedCard: null
        }
    }

    closeZoom = () => this.setState({ zoomedCard: null })

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
                                        <img
                                            className={`zoomable${item.cards[0].isReversed ? " rev" : ""}`}
                                            src={publicUrl(`decks/prisma-visions/${item.cards[0].name_short}.jpg`)}
                                            alt={`${item.cards[0].name}`}
                                            onClick={() => this.setState({ zoomedCard: item.cards[0] })} />
                                    </div>
                                    <div className="col align-top">
                                        <p className="reading-date">{new Date(item.timeStamp).toDateString()} · {new Date(item.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <h2 className="">{item.cards[0].name} {item.cards[0].isReversed && " (Reversed)"}</h2>
                                        <h4 className="blue">{item.cards[0].meaning}</h4>
                                        {item.notes && <p className="left-align history_notes"><strong className="gold">Notes</strong>{item.notes}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="danger" onClick={() => this.onDeleteHandle()}>Clear History</button>
                    </>
                    :
                    <>
                        <p>You have no available history yet.</p>
                        <p>Would you like to see your <span className="blue text-link" onClick={() => this.props.navigate('/today')}>tarot card for today</span>?</p>
                    </>
                }

                {this.state.zoomedCard &&
                    <CardLightbox
                        src={publicUrl(`decks/prisma-visions/${this.state.zoomedCard.name_short}.jpg`)}
                        alt={`${this.state.zoomedCard.name}${this.state.zoomedCard.isReversed ? " (Reversed)" : ""}`}
                        isReversed={this.state.zoomedCard.isReversed}
                        onClose={this.closeZoom}
                    />
                }

            </main>
        )
    }
}

export default withNavigate(withUser(withReading(PastDailies)))