import React from 'react'

// Minimal horizontal flip-card, replacing react-card-flip (unmaintained,
// breaks CJS/ESM interop under Vite 8 / @vitejs/plugin-react 6).
const CardFlip = ({ isFlipped, children }) => {
    const [front, back] = children

    const shared = {
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        height: '100%',
        left: '0',
        top: '0',
        transformStyle: 'preserve-3d',
        transition: '0.6s',
        width: '100%',
    }

    const frontStyle = {
        ...shared,
        position: isFlipped ? 'absolute' : 'relative',
        transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
        zIndex: '2',
    }

    const backStyle = {
        ...shared,
        position: isFlipped ? 'relative' : 'absolute',
        transform: `rotateY(${isFlipped ? 0 : -180}deg)`,
        zIndex: isFlipped ? '2' : '1',
    }

    return (
        <div className="react-card-flip" style={{ zIndex: 'auto' }}>
            <div className="react-card-flipper" style={{ height: '100%', perspective: '1000px', position: 'relative', width: '100%' }}>
                <div className="react-card-front" style={frontStyle}>{front}</div>
                <div className="react-card-back" style={backStyle}>{back}</div>
            </div>
        </div>
    )
}

export default CardFlip
