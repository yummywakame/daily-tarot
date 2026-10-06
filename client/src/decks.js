import { publicUrl } from './publicUrl.js'

/**
 * Available card image decks. Each id is a folder in client/public/decks/ holding
 * the same filenames (ar00.jpg, cuac.jpg, ..., cardback.jpg). Keep ids in sync with
 * the `deck` enum in models/User.js. All decks share the card meanings in the DB.
 * `landscape` decks have wide cards; `source` is credited on the About page, with the artist linked to `artistUrl` if set.
 */
const GALLERY = 'http://www.marytcusack.com/Decks/HTML/Tarot/'

export const DECKS = [
    { id: 'universal-fantasy', name: 'Universal Fantasy', artist: 'Paolo Martinello' },
    { id: 'stained-glass', name: 'Stained Glass', artist: 'James Edward', source: `${GALLERY}S/StainedGlass.html` },
    { id: 'romantic', name: 'Romantic', artist: 'Giulia F. Massaglia', source: `${GALLERY}R/Romantic.html` },
    { id: 'sambucus', name: 'Sambucus', artist: 'VermilionCollection', landscape: true, source: `${GALLERY}S/Sambucus.html` },
    { id: 'tranquil-dog', name: 'Tranquil Dog', artist: 'Wheel of Fortune Tarot Shop', artistUrl: 'https://www.kickstarter.com/projects/wheeloffortunetarot/the-tranquil-dog-tarot', source: `${GALLERY}T/TranquilDog.html` },
    { id: 'papercut', name: 'Papercut', artist: 'Shimilti', source: `${GALLERY}P/Papercut2.html` },
    { id: 'kashima', name: 'Kashima', artist: 'Jemima', source: `${GALLERY}K/Kashima.html` },
    { id: 'voice-and-vision', name: 'Voice and Vision', artist: 'Ciro Marchetti', source: `${GALLERY}V/VoiceVision.html` }
]

export const DEFAULT_DECK = DECKS[0].id

export const getDeck = deck => DECKS.find(d => d.id === deck) || DECKS[0]

export const cardImage = (deck, name_short) => publicUrl(`decks/${getDeck(deck).id}/${name_short}.jpg`)

export const cardBack = deck => cardImage(deck, 'cardback')

// If a deck image fails to load (e.g. a removed deck still saved on old readings or
// profiles), swap in the same card from the default deck. Listens in the capture
// phase because image error events don't bubble.
export function fallBackToDefaultDeck() {
    const prefix = publicUrl('decks/')
    window.addEventListener('error', e => {
        const img = e.target
        if (!(img instanceof HTMLImageElement)) return
        const src = img.getAttribute('src') || ''
        if (!src.startsWith(prefix)) return
        const [deck, file] = src.slice(prefix.length).split('/')
        if (!file || deck === DEFAULT_DECK) return
        img.src = publicUrl(`decks/${DEFAULT_DECK}/${file}`)
    }, true)
}
