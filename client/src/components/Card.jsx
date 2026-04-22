import React from 'react'

const Card = (props) => {


    return (
        <>
            {props.isReversed
                ?
                <img className="tarot-card rev" src={props.img} alt={props.altText} onClick={props.toggler} />
                :
                <img className="tarot-card" src={props.img} alt={props.altText} onClick={props.toggler} />
            }
        </>
    )
}

export default Card