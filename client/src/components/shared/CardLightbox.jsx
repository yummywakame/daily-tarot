import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

// Full-screen view of a single card image. Closes on click anywhere or Escape.
// Portalled to <body> so a transformed/filtered ancestor (e.g. the page-in animation
// on <main>) can't become the containing block for its position: fixed overlay.
const CardLightbox = ({ src, alt, isReversed, onClose }) => {
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose() }
        const prevOverflow = document.body.style.overflow
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = prevOverflow
        }
    }, [onClose])

    return createPortal(
        <div className="card-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
            <button className="card-lightbox-close" aria-label="Close" autoFocus onClick={onClose}>
                <i className="fas fa-times"></i>
            </button>
            <img className={isReversed ? "rev" : ""} src={src} alt={alt} />
        </div>,
        document.body
    )
}

export default CardLightbox
