import React from 'react'
import ReactCardFlip from 'react-card-flip'
import Card from '../Card.js'
import { withUser } from '../../context/UserProvider.js'
import { withCard } from '../../context/CardProvider.js'
import { withReading } from '../../context/ReadingProvider.js'
import NotesForm from '../NotesForm.js'

class Today extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlreadyRead: false,
            isFlipped: this.isAlreadyRead || false,
            isReversed: false,
            notes: this.props.readings.notes || ""
        }
    }

    toggleOnce = (event) => {
        event.preventDefault()
        if (!this.state.isFlipped) {
            window.scrollTo(0, 0)
            this.saveReading("save", 1, "daily", this.state.isReversed ? "rev" : "up")
            this.setState(prevState => {
                return { isFlipped: !prevState.isFlipped }
            })
        }
    }

    handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.saveReading("update", 1, "daily", this.state.isReversed ? "rev" : "up")
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // Randomly select upright or reversed
        this.uprightOrReverse()

        // If there is no reading for today, get a random card
        // Otherwise, display today's card
        if (this.props.readings.length === 0) {
            this.setState({
                isAlreadyRead: true
            })
            this.props.getRandomCard()
        } else {
            this.setState({
                isFlipped: true
            })
        }
        
    }

    saveReading(type, saveSpread, saveChoice, savePosition) {
        console.log(this.props.cards._id)

        const newReading = {
            user: this.props.user._id,
            spread: saveSpread,
            notes: this.state.notes,
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
        if (type === "save"){
            this.props.createReading(newReading)
        } else if (type === "update") {
            this.props.updateReading(this.props.readings._id, newReading)
        }
        
    }

    uprightOrReverse() {
        // If Reversed Cards are allowed, randomly select upright or reverse
        // 70% chance of upright, 30% chance of reverse
        console.log(this.props.user.allowRev)
        if (this.props.user.allowRev) {
            this.setState({
                isReversed: Math.random() >= 0.7
            })
        }
    }

    render() {
        // Get Random Card Details
        const { name, name_short, desc, meaning_up, meaning_up_long, meaning_rev, meaning_rev_long, element, astrology } = this.props.cards

        // Should the card details be reversed?
        const { isFlipped, isReversed } = this.state

        return (
            <main id="page-wrap">

                <div id="fill-page">

                    <h2>Your Card of the Day</h2>

                    <h3>{isFlipped ? `${name} ${isReversed ? "(Reversed)" : ""}` : `Click card to Reveal`}</h3>

                    <div className="flex-grid">

                        <div className="col">
                            <h4>Element</h4>
                            <p className="gold">{isFlipped ? `${element}` : `?`}</p>
                        </div>

                        <div className="col">

                            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                                <Card key="back" img={`/decks/prisma-visions/${name_short ? name_short : `cardback`}.jpg`} altText="Tarot Card Front" toggler={this.toggleOnce} isReversed={isReversed} />

                                { !isFlipped &&
                                <Card key="front" img="/decks/prisma-visions/cardback.jpg" altText="Tarot Card Back" toggler={this.toggleOnce} />
                                }
                            </ReactCardFlip>

                        </div>

                        <div className="col">
                            <h4>Astrology</h4>
                            <p className="gold">{isFlipped ? `${astrology}` : `?`}</p>
                        </div>

                    </div>

                    {isFlipped && <h4 className="blue">{isReversed ? meaning_rev : meaning_up}</h4>}


                </div>

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
                                {...this.state}
                            />
                        </div>
                    </div>
                }

            </main>
        )
    }

}

export default withUser(withCard(withReading(Today)))