import React, { useEffect } from 'react'

// Full-screen view of a single card image. Closes on click anywhere or Escape.
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

    return (
        <div className="card-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
            <button className="card-lightbox-close" aria-label="Close" autoFocus onClick={onClose}>
                <i className="fas fa-times"></i>
            </button>
            <img className={isReversed ? "rev" : ""} src={src} alt={alt} />
        </div>
    )
}

export default CardLightbox
