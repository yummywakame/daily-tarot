const mongoose = require('mongoose')
const Schema = mongoose.Schema

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