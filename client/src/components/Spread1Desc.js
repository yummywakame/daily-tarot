import React from 'react'
import { withUser } from '../context/UserProvider.js'
import { withCard } from '../context/CardProvider.js'
import { withReading } from '../context/ReadingProvider.js'
import NotesForm from './NotesForm.js'

class Spread1Desc extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: "meaning" }
    }

    showHideTabContents(tab) {
        this.setState({ currentTab: tab })
    }

    render() {
        console.log(this.state)
        const { isFlipped, isReversed, name, meaning_rev_long, meaning_up_long, desc, handleSubmit, handleChange, readingMsg, notes } = this.props
        return (
            <>
                {/* Only display the rest if card has been flipped */}
                {isFlipped &&
                    <div id="reveal">

                        <div id="tabs">
                            <button onClick={() => this.showHideTabContents("meaning")} className={(this.state.currentTab === "meaning" || !this.state.currentTab) ? "selected" : ""}>Meaning</button>
                            <button onClick={() => this.showHideTabContents("description")} className={this.state.currentTab === "description" ? "selected" : ""}>Card Description</button>
                            <button onClick={() => this.showHideTabContents("notes")} className={this.state.currentTab === "notes" ? "selected" : ""}>Notes</button>
                        </div>

                        {(this.state.currentTab === "meaning" || !this.state.currentTab) &&
                            <div className="card">
                                <h2>{name} {isReversed ? `Reversed Meaning` : `Upright Meaning`}</h2>
                                {isReversed ?
                                    <div dangerouslySetInnerHTML={{ __html: meaning_rev_long }}></div>
                                    :
                                    <div dangerouslySetInnerHTML={{ __html: meaning_up_long }}></div>
                                }
                            </div>
                        }

                        {this.state.currentTab === "description" &&
                            <div className="card">
                                <h2>{name} Card Description</h2>
                                <i className="blue">Based on the <a href="https://amzn.to/2I5FCMf">Rider-Waite</a> tarot deck</i>
                                <div dangerouslySetInnerHTML={{ __html: desc }}></div>
                            </div>
                        }

                        {this.state.currentTab === "notes" &&
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
                        }

                    </div>
                }
            </>
        )
    }

}

export default withUser(withCard(withReading(Spread1Desc)))