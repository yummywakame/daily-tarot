const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User.js')
const Deck = require('./Deck.js')

// Text fields a deck can override; everything else comes from the shared Card.
const DECK_CARD_FIELDS = ['name', 'meaning_up', 'meaning_rev', 'meaning_up_long', 'meaning_rev_long', 'desc']

// One card's own text for one deck, used instead of the default (Biddy Tarot)
// text when that deck's `useDefaultContent` is off.
const deckCardSchema = new Schema({
    deck: {
        type: String,
        enum: User.schema.path('deck').enumValues,
        required: true
    },
    card: {
        type: Schema.Types.ObjectId,
        ref: 'Card',
        required: true
    },
    name: String,
    meaning_up: String,
    meaning_rev: String,
    meaning_up_long: String,
    meaning_rev_long: String,
    desc: String
})

deckCardSchema.index({ deck: 1, card: 1 }, { unique: true })

// Returns the card with the deck's own text laid over it, or the card unchanged
// if the deck uses the default text or has none saved. Empty fields fall back.
deckCardSchema.statics.applyTo = async function (card, deck) {
    if (!card || !deck) return card
    const settings = await Deck.findOne({ deck }).lean()
    if (!settings || settings.useDefaultContent) return card
    const custom = await this.findOne({ deck, card: card._id }).lean()
    if (!custom) return card
    const merged = typeof card.toObject === 'function' ? card.toObject() : { ...card }
    for (const field of DECK_CARD_FIELDS) {
        if (custom[field]) merged[field] = custom[field]
    }
    return merged
}

module.exports = mongoose.model('DeckCard', deckCardSchema)
