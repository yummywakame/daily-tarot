import React from 'react'
import { withUser } from '../../context/UserProvider.js'
import { withCard } from '../../context/CardProvider.js'
import { withReading } from '../../context/ReadingProvider.js'
import Spread1 from '../Spread1.js'
import Spread1Desc from '../Spread1Desc.js'

class Today extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAlreadyRead: false,
            isFlipped: this.isAlreadyRead || false,
            isReversed: false
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

    // Get new reading when the button is clicked
    getNewReading = (e) => {
        e.preventDefault()
        // reset everything card reading related
        this.setState({
            isAlreadyRead: false,
            isFlipped: false,
            notes: ""
        })
        
        // Randomly select upright or reversed
        this.uprightOrReverse()

        // get a new random card after 1 second delay
        setTimeout(() => {
            this.props.getRandomCard()
        }, 500)
    }

    // Saves a reading to the database by User's ID and date
    saveReading(type, saveSpread, saveChoice, savePosition) {

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

        if (type === "save") {
            this.props.createReading(newReading)
        } else if (type === "update") {
            this.props.updateReading(this.props.readings._id, newReading)
        }

    }

    uprightOrReverse() {
        // If Reversed Cards are allowed, randomly select upright or reverse
        // 70% chance of upright, 30% chance of reverse
        if (this.props.user.allowRev) {
            this.setState({
                isReversed: Math.random() >= 0.7
            })
        }
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

    render() {
        // Get Random Card Details
        const { name, name_short, desc, meaning_up, meaning_up_long, meaning_rev, meaning_rev_long, element, astrology } = this.props.cards

        // Should the card details be reversed?
        const { isFlipped, isReversed } = this.state

        return (
            <main id="page-wrap">

                <div id="fill-page">

                    <h2>Your Card of the Day</h2>

                    <Spread1
                        isFlipped={isFlipped}
                        isReversed={isReversed}
                        name={name}
                        name_short={name_short}
                        element={element}
                        astrology={astrology}
                        toggleOnce={this.toggleOnce}
                    />

                    {isFlipped && <h4 className="blue">{isReversed ? meaning_rev : meaning_up}</h4>}

                    {isFlipped && <button onClick={this.getNewReading}>Get Another Card</button>}


                </div>

                <Spread1Desc
                    isFlipped={isFlipped}
                    isReversed={isReversed}
                    name={name}
                    meaning_rev_long={meaning_rev_long}
                    meaning_up_long={meaning_up_long}
                    desc={desc}
                    notes={this.props.readings.notes}
                />

            </main>
        )
    }

}

export default withUser(withCard(withReading(Today)))