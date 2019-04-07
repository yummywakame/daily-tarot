import React from 'react'
import ReactCardFlip from 'react-card-flip'
import Card from './Card.js'

const Spread1 = (props) => {

  return (
    <>
      <h3>{props.isFlipped ? `${props.name} ${props.isReversed ? "(Reversed)" : ""}` : `Click card to Reveal`}</h3>

      <div className="flex-grid">

        <div className="col">
          <h4>Element</h4>
          <p className="gold">{props.isFlipped ? `${props.element}` : `?`}</p>
        </div>

        <div className="col">

          <ReactCardFlip isFlipped={props.isFlipped} flipDirection="horizontal">
            <Card key="back" img={`/decks/prisma-visions/${props.name_short ? props.name_short : `cardback`}.jpg`} altText="Tarot Card Front" toggler={props.toggleOnce} isReversed={props.isReversed} />
            <Card key="front" img="/decks/prisma-visions/cardback.jpg" altText="Tarot Card Back" toggler={props.toggleOnce} />
          </ReactCardFlip>

        </div>

        <div className="col">
          <h4>Astrology</h4>
          <p className="gold">{props.isFlipped ? `${props.astrology}` : `?`}</p>
        </div>

      </div>
    </>
  )
}

export default Spread1