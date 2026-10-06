const express = require('express')
const { randomInt } = require('crypto')
const cardRouter = express.Router()
const Card = require('../models/Card.js')
const User = require('../models/User.js')
const DeckCard = require('../models/DeckCard.js')
const requireAdmin = require('../middleware/requireAdmin.js')

const MAX_CARD_VALUE = 77

// Keep only top-level fields defined on the Card schema, so update operators
// (e.g. $unset, $rename) or unknown keys in the request body are ignored.
const cardFields = (body) => Object.fromEntries(
    Object.entries(body).filter(([key]) => key !== '_id' && !key.startsWith('$') && Card.schema.path(key))
)

// The logged-in user's card text: their deck's own text if it has any, else the default
const forUser = async (req, card) => {
    const user = await User.findById(req.user._id).select('deck').lean()
    return DeckCard.applyTo(card, user?.deck)
}

// GET ALL (default text, as used by the admin card editor)
cardRouter.get('/', async (req, res) => {
    try {
        const cards = await Card.find()
        return res.status(200).json(cards)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve cards.' })
    }
})

// GET ARRAY OF RANDOM CARDS
// Note: this route must come before /:_id to avoid 'random' being treated as an id
cardRouter.get('/random/:spreadcount/:max', async (req, res) => {
    try {
        const spreadcount = Number(req.params.spreadcount)
        const max = Number(req.params.max)

        // The deck has 78 cards (value_int 0-77). spreadcount must fit within the range,
        // otherwise the unique-number loop below would never finish.
        if (!Number.isInteger(max) || max < 0 || max > MAX_CARD_VALUE ||
            !Number.isInteger(spreadcount) || spreadcount < 1 || spreadcount > max + 1) {
            return res.status(400).json({ errMsg: 'Invalid spread count or card range.' })
        }

        if (spreadcount === 1) {
            const cardNum = randomInt(max + 1)
            const card = await Card.findOne({ value_int: cardNum })
            return res.status(200).json(await forUser(req, card))
        }

        const exists = []
        const arr = []
        let randNum
        for (let i = 0; i < spreadcount; i++) {
            do {
                randNum = randomInt(max + 1)
            } while (exists[randNum])
            exists[randNum] = true
            arr.push(randNum)
        }

        const cards = await Card.find().where('value_int').in(arr)
        return res.status(200).json(await Promise.all(cards.map(card => forUser(req, card))))
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve random cards.' })
    }
})

// GET CARD BY value_int
cardRouter.get('/cardvalue/:cardvalue', async (req, res) => {
    try {
        const card = await Card.findOne({ value_int: req.params.cardvalue })
        return res.status(200).json(await forUser(req, card))
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve card.' })
    }
})

// GET ONE
cardRouter.get('/:_id', async (req, res) => {
    try {
        const card = await Card.findById(req.params._id)
        return res.status(200).json(await forUser(req, card))
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve card.' })
    }
})

// POST Add One (admin only)
cardRouter.post('/', requireAdmin, async (req, res) => {
    try {
        const newCard = new Card(req.body)
        const saved = await newCard.save()
        return res.status(201).json(saved)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to create card.' })
    }
})

// DELETE ONE (admin only)
cardRouter.delete('/:_id', requireAdmin, async (req, res) => {
    try {
        await Card.findByIdAndDelete(req.params._id)
        await DeckCard.deleteMany({ card: req.params._id })
        return res.status(200).json({ message: `Successfully deleted card with ID ${req.params._id}` })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to delete card.' })
    }
})

// PUT (admin only)
cardRouter.put('/:_id', requireAdmin, async (req, res) => {
    try {
        const updated = await Card.findByIdAndUpdate(req.params._id, { $set: cardFields(req.body) }, { returnDocument: 'after', runValidators: true })
        return res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to update card.' })
    }
})

module.exports = cardRouter
