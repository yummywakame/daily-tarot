const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User.js')

const readingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    spread: {
        type: Number,
        default: 1
    },
    notes: {
        type: String,
    },
    choice: {
        type: String,
        enum: ["daily", "question"],
        default: "daily"
    },
    // Deck the reading was drawn with, so history keeps showing that deck's art.
    // Readings saved before decks existed have none and fall back to the default deck (Universal Fantasy).
    deck: {
        type: String,
        enum: User.schema.path('deck').enumValues
    },
    cards: [{
        cardId: {
            type: Schema.Types.ObjectId,
            ref: 'Card',
            required: true
        },
        isReversed: {
            type: Boolean,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        name_short: {
            type: String,
            required: true
        },
        meaning: {
            type: String,
            required: true
        }
    }]
})

module.exports = mongoose.model('Reading', readingSchema)