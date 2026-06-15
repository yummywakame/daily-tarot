import React from 'react'
import CardFlip from './CardFlip.jsx'
import Card from './Card.jsx'
import { publicUrl } from '../publicUrl.js'

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

          <CardFlip isFlipped={isFlipped}>
            <Card key="front" img={publicUrl('decks/prisma-visions/cardback.jpg')} altText="Tarot Card Back" toggler={toggleOnce} />
            <Card key="back" img={publicUrl(`decks/prisma-visions/${name_short ? name_short : `cardback`}.jpg`)} altText="Tarot Card Front" toggler={toggleOnce} isReversed={isReversed} />
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