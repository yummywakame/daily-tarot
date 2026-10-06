import React from 'react'
import CardFlip from './CardFlip.jsx'
import Card from './Card.jsx'
import { cardImage, cardBack, getDeck } from '../decks.js'

const Spread1 = (props) => {
  const { isFlipped, isReversed, toggleOnce, name, name_short, element, astrology, deck } = props

  return (
    <>
      <h3>{isFlipped ? `${name} ${isReversed ? "(Reversed)" : ""}` : `Click card to Reveal`}</h3>

      <div className={getDeck(deck).landscape ? "flex-grid spread landscape" : "flex-grid spread"}>

        <div className="col">
          <h4>Element</h4>
          <p className="gold">{isFlipped ? `${element}` : `?`}</p>
        </div>

        <div className="col">

          <CardFlip isFlipped={isFlipped}>
            <Card key="front" img={cardBack(deck)} altText="Tarot Card Back" toggler={toggleOnce} />
            <Card key="back" img={name_short ? cardImage(deck, name_short) : cardBack(deck)} altText="Tarot Card Front" toggler={toggleOnce} isReversed={isReversed} zoomable={isFlipped} />
          </CardFlip>

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