import React from 'react'
import { withUser } from '../context/UserProvider.js'
import { withCard } from '../context/CardProvider.js'
import { withReading } from '../context/ReadingProvider.js'
import NotesForm from './NotesForm.js'

class Spread1Desc extends React.Component {

    render() {
        const { isFlipped, isReversed, name, meaning_rev_long, meaning_up_long, desc, handleSubmit, handleChange, readingMsg, notes } = this.props
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
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                readingMsg={readingMsg}
                                notes={notes}
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