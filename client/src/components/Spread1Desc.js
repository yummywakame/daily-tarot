import React from 'react'
import { withUser } from '../context/UserProvider.js'
import { withCard } from '../context/CardProvider.js'
import { withReading } from '../context/ReadingProvider.js'
import NotesForm from './NotesForm.js'

class Spread1Desc extends React.Component {

    handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.modifyReading(1, "daily", this.props.isReversed ? "rev" : "up")
    }

    // Both saves, or updates a reading
    modifyReading(saveSpread, saveChoice, savePosition) {

        const newReading = {
            user: this.props.user._id,
            spread: saveSpread,
            notes: this.props.notes,
            choice: saveChoice,
            cards: [
                {
                    position: savePosition,
                    cardId: this.props.cards._id,
                    name: this.props.cards.name,
                    name_short: this.props.cards.name_short,
                    meaning: (savePosition === "rev") ? this.props.cards.meaning_rev : this.props.cards.meaning_up
                }
            ]
        }
        this.props.updateReading(this.props.readings._id, newReading)
    }

    render() {
        const { isFlipped, isReversed, name, meaning_rev_long, meaning_up_long, desc } = this.props
        return (
            <>
                {/* Only display the rest if card has been flipped */}
                {isFlipped &&
                    <div id="reveal">
                        <div className="card">
                            <h2>{name} {isReversed ? `Reversed Meaning` : `Upright Meaning`}</h2>
                            {isReversed ?
                                <div dangerouslySetInnerHTML={{ __html: meaning_rev_long }}></div>
                                :
                                <div dangerouslySetInnerHTML={{ __html: meaning_up_long }}></div>
                            }

                        </div>

                        <div className="card">
                            <h2>{name} Card Description</h2>
                            <i className="blue">Based on the <a href="https://amzn.to/2I5FCMf">Rider-Waite</a> tarot deck</i>
                            <div dangerouslySetInnerHTML={{ __html: desc }}></div>
                        </div>

                        <div className="card" id="add-form">
                            <h2>Diary Notes</h2>
                            <NotesForm
                                handleChange={this.handleChange}
                                handleSubmit={this.handleSubmit}
                                readingMsg={this.props.readingMsg}
                                {...this.state}
                            />
                        </div>
                    </div>
                }
            </>
        )
    }

}

export default withUser(withCard(withReading(Spread1Desc)))