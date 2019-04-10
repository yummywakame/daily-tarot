const express = require('express')
const cardRouter = express.Router()
const Card = require('../models/Card.js') // Name to create new document

// GET ALL
cardRouter.get('/', (req, res) => {
    Card.find((err, cards) => {
        // Always handle DB errors first
        if (err) {
            res.status(500)
            return res.send(err)
        }
        // Send back response
        return res.status(200).send(cards)
    })
})

// GET ONE
cardRouter.get('/:_id', (req, res) => {
    // This {object} is our filtering criteria for what we are looking for
    Card.findOne({ _id: req.params._id }, (err, foundCard) => {
        if (err) {
            res.status(500)
            return res.send(err)
        }
        return res.status(200).send(foundCard)
    })
})

// GET ARRAY OF RANDOM CARDS
cardRouter.get('/random/:spreadcount/:max', (req, res) => {

    // spreadcount is 3 for a Past, Present, Future draw
    if (Number(req.params.spreadcount) === 1) {

        // Get random value_int value between 0 and max number of cards available
        const cardNum = Math.floor(Math.random() * (Number(req.params.max) + 1))

        // Grab the card that has that value_int
        Card.findOne({ value_int: cardNum }, (err, foundCard) => {

            if (err) {
                res.status(500)
                return res.send(err)
            }
            return res.status(200).send(foundCard)
        })

    } else {
        // Generate a spreadcount length array of value_ints
        // with non-repeating values
        let exists = []
        let arr = []
        let randNum
        const spreadcount = Number(req.params.spreadcount)

        for (var len = 0; len < spreadcount; len++) {
            do {
                randNum = Math.floor(Math.random() * (Number(req.params.max) + 1))
            } while (exists[randNum])
            exists[randNum] = true
            arr.push(randNum)
        }

        // Now find cards that match those value_ids
        Card.find((err, foundCards) => {

            if (err) {
                res.status(500)
                return res.send(err)
            }
            return res.status(200).send(foundCards)
        }).where('value_int').in(arr).exec()

    }

})

// GET CARD BY value_int
cardRouter.get('/cardvalue/:cardvalue', (req, res) => {
    // This {object} is our filtering criteria for what we are looking for
    Card.findOne({ value_int: req.params.cardvalue }, (err, foundCard) => {

        if (err) {
            res.status(500)
            return res.send(err)
        }
        return res.status(200).send(foundCard)
    })
})

// POST Add One (never queries the db)
cardRouter.post('/', (req, res) => {
    // Create the new card object using our Schema and the values from the body the user posted
    const newCard = new Card(req.body)
    // Send that object to the DB to be saved
    newCard.save((err, newCardObject) => {
        if (err) {
            res.status(500)
            return res.send(err)
        }
        return res.status(201).send(newCardObject)
    })
})

// DELETE ONE
cardRouter.delete('/:_id', (req, res) => {
    Card.findOneAndRemove({ _id: req.params._id }, (err, deletedCard) => {
        if (err) {
            res.status(500)
            return res.send(err)
        }
        // 202 allows for a response message, 204 deletes but has no message
        return res.status(202).send(`Successfully deleted Card "${deletedCard.title}" with ID ${req.params._id}`)
    })
})

// PUT
cardRouter.put('/:_id', (req, res) => {
    Card.findOneAndUpdate(
        { _id: req.params._id },
        req.body,
        { new: true },
        (err, updatedCard) => {
            if (err) {
                res.status(500)
                return res.send(err)
            }
            return res.status(201).send(updatedCard)
        })
})

module.exports = cardRouter