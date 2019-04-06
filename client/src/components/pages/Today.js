import React from 'react'
import ReactCardFlip from 'react-card-flip'
import Card from '../Card.js'
import { withCard } from '../../context/CardProvider.js'

class Today extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFlipped: false
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
        this.props.getRandomCard()
    }

    render() {
        // Get Random Card Details
        const {
            name, 
            name_short, 
            desc, 
            value, 
            type, 
            meaning_up, 
            meaning_up_long, 
            meaning_rev, 
            meaning_rev_long, 
            element, 
            astrology
        } = this.props.cards
        
        console.log(this.props.cards)
        
        return (
            <main id="page-wrap">

                <div id="fill-page">
                
                    <h2>Your Card of the Day</h2>
                    
                    <h3>{this.state.isFlipped ? `${name}` : `Click card to Reveal`}</h3>
                    
                    <div className="flex-grid">

                        <div className="col">
                            <h4>Element</h4>
                            <p className="gold">{this.state.isFlipped ? `${element}` : `?`}</p>
                        </div>

                        <div className="col">

                            <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">
                                <Card key="back" img={`/decks/prisma-visions/${name_short}.jpg`} altText="Tarot Card Front" toggler={this.toggler} />

                                <Card key="front" img="/decks/prisma-visions/cardback.jpg" altText="Tarot Card Back" toggler={this.toggler} />
                                
                            </ReactCardFlip>
                            
                            {/* <img className="tarot-front" src="./decks/prisma-visions/cardback.jpg" alt="The Sun" /> */}
                        </div>

                        <div className="col">
                            <h4>Astrology</h4>
                            <p className="gold">{this.state.isFlipped ? `${astrology}` : `?`}</p>
                        </div>

                    </div>
                    
                    {this.state.isFlipped && 
                    <h4>{meaning_up}</h4>
                    }
                    

                </div>
                {this.state.isFlipped && 
                <div id="reveal">
                    <div className="card">
                        <h2>Upright Meaning</h2>
                        <div dangerouslySetInnerHTML={{__html: meaning_up_long}}></div>
                    </div>

                    <div className="card">
                        <h2>Card Description</h2>
                        <div dangerouslySetInnerHTML={{__html: desc}}></div>
                    </div>
                </div>
                }

            </main>
        )
    }

}

export default withCard(Today)