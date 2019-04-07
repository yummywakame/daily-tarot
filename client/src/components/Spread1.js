import React from 'react'
import ReactCardFlip from 'react-card-flip'
import Card from './Card.js'

const Spread1 = (props) => {
  const { isFlipped, isReversed, toggleOnce, name, name_short, element, astrology } = props

  return (
    <>
      <h3>{isFlipped ? `${name} ${isReversed ? "(Reversed)" : ""}` : `Click card to Reveal`}</h3>

      <div className="flex-grid">

        <div className="col">
          <h4>Element</h4>
          <p className="gold">{isFlipped ? `${element}` : `?`}</p>
        </div>

        <div className="col">

          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <Card key="back" img={`/decks/prisma-visions/${name_short ? name_short : `cardback`}.jpg`} altText="Tarot Card Front" toggler={toggleOnce} isReversed={isReversed} />
            <Card key="front" img="/decks/prisma-visions/cardback.jpg" altText="Tarot Card Back" toggler={toggleOnce} />
          </ReactCardFlip>

        </div>

        <div className="col">
          <h4>Astrology</h4>
          <p className="gold">{isFlipped ? `${astrology}` : `?`}</p>
        </div>

      </div>
    </>
  )
}

export default Spread1