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