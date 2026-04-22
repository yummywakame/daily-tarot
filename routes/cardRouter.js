const express = require('express')
const cardRouter = express.Router()
const Card = require('../models/Card.js')

// GET ALL
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

        if (spreadcount === 1) {
            const cardNum = Math.floor(Math.random() * (max + 1))
            const card = await Card.findOne({ value_int: cardNum })
            return res.status(200).json(card)
        }

        const exists = []
        const arr = []
        let randNum
        for (let i = 0; i < spreadcount; i++) {
            do {
                randNum = Math.floor(Math.random() * (max + 1))
            } while (exists[randNum])
            exists[randNum] = true
            arr.push(randNum)
        }

        const cards = await Card.find().where('value_int').in(arr)
        return res.status(200).json(cards)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve random cards.' })
    }
})

// GET CARD BY value_int
cardRouter.get('/cardvalue/:cardvalue', async (req, res) => {
    try {
        const card = await Card.findOne({ value_int: req.params.cardvalue })
        return res.status(200).json(card)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve card.' })
    }
})

// GET ONE
cardRouter.get('/:_id', async (req, res) => {
    try {
        const card = await Card.findById(req.params._id)
        return res.status(200).json(card)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve card.' })
    }
})

// POST Add One
cardRouter.post('/', async (req, res) => {
    try {
        const newCard = new Card(req.body)
        const saved = await newCard.save()
        return res.status(201).json(saved)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to create card.' })
    }
})

// DELETE ONE
cardRouter.delete('/:_id', async (req, res) => {
    try {
        await Card.findByIdAndDelete(req.params._id)
        return res.status(200).json({ message: `Successfully deleted card with ID ${req.params._id}` })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to delete card.' })
    }
})

// PUT
cardRouter.put('/:_id', async (req, res) => {
    try {
        const updated = await Card.findByIdAndUpdate(req.params._id, req.body, { new: true })
        return res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to update card.' })
    }
})

module.exports = cardRouter
