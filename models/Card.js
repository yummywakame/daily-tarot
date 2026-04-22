const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema defines what the data should look like (enforces)
const cardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    name_short: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["major", "minor"],
        required: true
    },
    suit: {
        type: String,
        enum: ["wands", "cups", "pentacles", "swords"]
    },
    desc: {
        type: String,
        required: true
    },
    meaning_up_long: {
        type: String,
        required: true
    },
    meaning_rev_long: {
        type: String,
        required: true
    },
    meaning_up: {
        type: String
    },
    meaning_rev: {
        type: String
    },
    value: {
        type: String,
        required: true
    },
    value_int: {
        type: Number,
        default: 0
    },
    astrology: {
        type: String
    },
    element: {
        type: String,
        enum: ["Air", "Fire", "Earth", "Water"]
    }
})

// arg1 a string representation of what the collection will be called for each item
// arg2 which schema should this collection be tied to
module.exports = mongoose.model("Card", cardSchema)