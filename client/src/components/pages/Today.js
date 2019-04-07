import React from 'react'
import ReactCardFlip from 'react-card-flip'
import Card from '../Card.js'
import { withCard } from '../../context/CardProvider.js'

class Today extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFlipped: false,
            isReversed: false
        }
    }

    toggler = (event) => {
        event.preventDefault()
        this.setState(prevState => {
            return { isFlipped: !prevState.isFlipped }
        })
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        
        this.uprightOrReverse()
        
        this.getNewRandomCardAndSave()
        
    }
    
    getNewRandomCardAndSave() {
        this.props.getRandomCard()


    }
    
    uprightOrReverse() {
        // If Reversed Cards are allowed, randomly select upright or reverse
        // 70% chance of upright, 30% chance of reverse
        if (this.props.allowRev) {
            this.setState({
                isReversed: Math.random() >= 0.7
            })
        }
        
        
    }

    render() {
        // Get Random Card Details
        const {
            name,
            name_short,
            desc,
            meaning_up,
            meaning_up_long,
            meaning_rev,
            meaning_rev_long,
            element,
            astrology
        } = this.props.cards

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
                                <Card key="back" img={`/decks/prisma-visions/${name_short ? name_short : `cardback`}.jpg`} altText="Tarot Card Front" toggler={this.toggler} isReversed={isReversed} />

                                <Card key="front" img="/decks/prisma-visions/cardback.jpg" altText="Tarot Card Back" toggler={this.toggler} />

                            </ReactCardFlip>

                        </div>

                        <div className="col">
                            <h4>Astrology</h4>
                            <p className="gold">{isFlipped ? `${astrology}` : `?`}</p>
                        </div>

                    </div>

                    {isFlipped &&
                        <h4 className="blue">{isReversed ? meaning_rev : meaning_up}</h4>
                    }


                </div>
                {isFlipped &&
                    <div id="reveal">
                        <div className="card">
                            <h2>{isReversed ? `Reversed Meaning` : `Upright Meaning`}</h2>
                            {isReversed ?
                                <div dangerouslySetInnerHTML={{ __html: meaning_rev_long }}></div>
                                :
                                <div dangerouslySetInnerHTML={{ __html: meaning_up_long }}></div>
                            }

                        </div>

                        <div className="card">
                            <h2>General Card Description</h2>
                            <i className="blue">Based on the <a href="https://amzn.to/2I5FCMf">Rider-Waite</a> tarot deck</i>
                            <div dangerouslySetInnerHTML={{ __html: desc }}></div>
                        </div>
                    </div>
                }

            </main>
        )
    }

}

export default withCard(Today)