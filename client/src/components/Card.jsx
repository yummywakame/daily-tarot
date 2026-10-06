import React from 'react'

const Card = (props) => {
    const className = ["tarot-card", props.isReversed && "rev", props.zoomable && "zoomable"].filter(Boolean).join(" ")

    return (
        <img className={className} src={props.img} alt={props.altText} onClick={props.toggler} />
    )
}

export default Card
