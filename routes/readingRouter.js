const express = require('express')
const readingRouter = express.Router()
const Reading = require('../models/Reading.js')

// GET ALL
readingRouter.get('/', async (req, res) => {
    try {
        const readings = await Reading.find()
        return res.status(200).json(readings)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve readings.' })
    }
})

// GET ALL BY USER ID
// Note: this route must come before /:_id to avoid 'user' being treated as an id
readingRouter.get('/user/:user', async (req, res) => {
    try {
        const readings = await Reading.find({ user: req.params.user })
        return res.status(200).json(readings)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve readings.' })
    }
})

// DELETE ALL BY USER ID
readingRouter.delete('/user/:user', async (req, res) => {
    try {
        await Reading.deleteMany({ user: req.params.user })
        return res.status(200).json({ message: 'Successfully deleted all past readings.' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to delete readings.' })
    }
})

// GET ONE
readingRouter.get('/:_id', async (req, res) => {
    try {
        const reading = await Reading.findById(req.params._id)
        return res.status(200).json(reading)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve reading.' })
    }
})

// POST Add One
readingRouter.post('/', async (req, res) => {
    try {
        const newReading = new Reading(req.body)
        const saved = await newReading.save()
        return res.status(201).json(saved)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to create reading.' })
    }
})

// DELETE ONE
readingRouter.delete('/:_id', async (req, res) => {
    try {
        await Reading.findByIdAndDelete(req.params._id)
        return res.status(200).json({ message: `Successfully deleted reading with ID ${req.params._id}` })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to delete reading.' })
    }
})

// PUT
readingRouter.put('/:_id', async (req, res) => {
    try {
        const updated = await Reading.findByIdAndUpdate(req.params._id, req.body, { new: true })
        return res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to update reading.' })
    }
})

module.exports = readingRouter
