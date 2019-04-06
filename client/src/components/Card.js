import React from 'react'

const Card = (props) => {
    return (
        <>
            <img className="tarot-card" src={props.img} alt={props.altText} onClick={props.toggler} />
        </>
    )
}

export default Card