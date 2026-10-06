const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User.js')

// Per-deck content settings. A deck with no document here uses the default
// (Biddy Tarot) card text, same as `useDefaultContent: true`.
const deckSchema = new Schema({
    deck: {
        type: String,
        enum: User.schema.path('deck').enumValues,
        required: true,
        unique: true
    },
    // When true, the deck's own card text (DeckCard) is kept but ignored
    useDefaultContent: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Deck', deckSchema)
