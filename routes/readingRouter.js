const express = require('express')
const readingRouter = express.Router()
const Reading = require('../models/Reading.js') // Name to create new document

// GET ALL
readingRouter.get('/', (req, res) => {
    Reading.find((err, readings) => {
        // Always handle DB errors first
        if (err) {
            res.status(500)
            return res.send(err)
        }
        // Send back response
        return res.status(200).send(readings)
    })
})

// GET ALL BY USER ID
readingRouter.get('/user/:user', (req, res) => {
    // This {object} is our filtering criteria for what we are looking for
    Reading.find({ user: req.params.user }, (err, foundReadings) => {
        if (err) {
            res.status(500)
            return res.send(err)
        }
        return res.status(200).send(foundReadings)
    })
})

// GET ONE
readingRouter.get('/:_id', (req, res) => {
    // This {object} is our filtering criteria for what we are looking for
    Reading.findOne({ _id: req.params._id }, (err, foundReading) => {
        if (err) {
            res.status(500)
            return res.send(err)
        }
        return res.status(200).send(foundReading)
    })
})

// POST Add One (never queries the db)
readingRouter.post('/', (req, res) => {
    // Create the new reading object using our Schema and the values from the body the user posted
    const newReading = new Reading(req.body)
    // Send that object to the DB to be saved
    newReading.save((err, newReadingObject) => {
        if (err) {
            res.status(500)
            return res.send(err)
        }
        return res.status(201).send(newReadingObject)
    })
})

// DELETE ONE
readingRouter.delete('/:_id', (req, res) => {
    Reading.findOneAndRemove({ _id: req.params._id }, (err, deletedReading) => {
        if (err) {
            res.status(500)
            return res.send(err)
        }
        // 202 allows for a response message, 204 deletes but has no message
        return res.status(202).send(`Successfully deleted Reading "${deletedReading.title}" with ID ${req.params._id}`)
    })
})

// PUT
readingRouter.put('/:_id', (req, res) => {
    Reading.findOneAndUpdate(
        { _id: req.params._id },
        req.body,
        { new: true },
        (err, updatedReading) => {
            if (err) {
                res.status(500)
                return res.send(err)
            }
            return res.status(201).send(updatedReading)
        })
})

module.exports = readingRouter