const express = require('express')
const Joi = require('joi')
const readingRouter = express.Router()
const Reading = require('../models/Reading.js')
const User = require('../models/User.js')
const requireAdmin = require('../middleware/requireAdmin.js')

// Readings are always owned by the logged-in user (req.user from the JWT).
// The `user` field is never taken from the request body.
const withoutOwner = ({ user, _id, ...rest }) => rest

// Fields a reading update may change. Unknown keys (including update operators
// like $unset) are stripped, and each value must be a plain value of the right type.
const readingUpdateSchema = Joi.object({
    notes: Joi.string().allow(''),
    choice: Joi.string().valid('daily', 'question'),
    spread: Joi.number().integer().min(1),
    timeStamp: Joi.date(),
    cards: Joi.array().items(Joi.object({
        cardId: Joi.string().hex().length(24).required(),
        isReversed: Joi.boolean().required(),
        name: Joi.string().required(),
        name_short: Joi.string().required(),
        meaning: Joi.string().required()
    }).unknown(false))
})

// GET ALL (admin only)
readingRouter.get('/', requireAdmin, async (req, res) => {
    try {
        const readings = await Reading.find()
        return res.status(200).json(readings)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve readings.' })
    }
})

// GET ALL BY USER ID (self or admin)
// Note: this route must come before /:_id to avoid 'user' being treated as an id
readingRouter.get('/user/:user', async (req, res) => {
    if (req.params.user !== req.user._id && !req.user.isAdmin) {
        return res.status(403).json({ errMsg: 'Forbidden' })
    }
    try {
        const readings = await Reading.find({ user: req.params.user })
        return res.status(200).json(readings)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve readings.' })
    }
})

// DELETE ALL BY USER ID (self only)
readingRouter.delete('/user/:user', async (req, res) => {
    if (req.params.user !== req.user._id) {
        return res.status(403).json({ errMsg: 'Forbidden' })
    }
    try {
        await Reading.deleteMany({ user: req.user._id })
        return res.status(200).json({ message: 'Successfully deleted all past readings.' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to delete readings.' })
    }
})

// GET ONE (owner or admin)
readingRouter.get('/:_id', async (req, res) => {
    try {
        const filter = req.user.isAdmin ? { _id: req.params._id } : { _id: req.params._id, user: req.user._id }
        const reading = await Reading.findOne(filter)
        if (!reading) return res.status(404).json({ errMsg: 'Reading not found.' })
        return res.status(200).json(reading)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve reading.' })
    }
})

// POST Add One (owned by the logged-in user, drawn with their current deck)
readingRouter.post('/', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('deck').lean()
        // Skip a saved deck that has since been removed from the enum, so the save doesn't fail
        const deck = User.schema.path('deck').enumValues.includes(user?.deck) ? user.deck : undefined
        const newReading = new Reading({ ...withoutOwner(req.body), user: req.user._id, deck })
        const saved = await newReading.save()
        return res.status(201).json(saved)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to create reading.' })
    }
})

// DELETE ONE (owner only)
readingRouter.delete('/:_id', async (req, res) => {
    try {
        const deleted = await Reading.findOneAndDelete({ _id: req.params._id, user: req.user._id })
        if (!deleted) return res.status(404).json({ errMsg: 'Reading not found.' })
        return res.status(200).json({ message: `Successfully deleted reading with ID ${req.params._id}` })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to delete reading.' })
    }
})

// PUT (owner only)
readingRouter.put('/:_id', async (req, res) => {
    const { error, value: updates } = readingUpdateSchema.validate(req.body, { stripUnknown: true })
    if (error) {
        return res.status(400).json({ errMsg: error.details[0].message })
    }
    try {
        const updated = await Reading.findOneAndUpdate(
            { _id: req.params._id, user: req.user._id },
            { $set: updates },
            { returnDocument: 'after', runValidators: true }
        )
        if (!updated) return res.status(404).json({ errMsg: 'Reading not found.' })
        return res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to update reading.' })
    }
})

module.exports = readingRouter
