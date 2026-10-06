const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')
const adminRouter = express.Router()
const User = require('../models/User.js')
const Reading = require('../models/Reading.js')
const Card = require('../models/Card.js')
const Deck = require('../models/Deck.js')
const DeckCard = require('../models/DeckCard.js')
const requireAdmin = require('../middleware/requireAdmin.js')

// Every route in this file is admin only.
adminRouter.use(requireAdmin)

// Reject malformed ids up front instead of letting Mongoose throw a CastError (500).
adminRouter.param('_id', (req, res, next, id) => {
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ errMsg: 'Invalid id.' })
    }
    next()
})

const DECK_IDS = User.schema.path('deck').enumValues
adminRouter.param('deck', (req, res, next, deck) => {
    if (!DECK_IDS.includes(deck)) {
        return res.status(400).json({ errMsg: 'Unknown deck.' })
    }
    next()
})

const isSelf = (req) => req.params._id === req.user._id

const roleSchema = Joi.object({
    isAdmin: Joi.boolean().required()
})

// Card text fields an admin may edit. name_short, value_int etc. are left alone
// because they tie a card to its image file and to the random draw.
const cardUpdateSchema = Joi.object({
    name: Joi.string().trim().min(1).max(100),
    desc: Joi.string().trim().min(1).max(10000),
    meaning_up: Joi.string().trim().allow('').max(500),
    meaning_rev: Joi.string().trim().allow('').max(500),
    meaning_up_long: Joi.string().trim().min(1).max(10000),
    meaning_rev_long: Joi.string().trim().min(1).max(10000),
    astrology: Joi.string().trim().allow('').max(100),
    element: Joi.string().valid('Air', 'Fire', 'Earth', 'Water')
})

const deckSettingsSchema = Joi.object({
    useDefaultContent: Joi.boolean().required()
})

// A deck's own text for one card. Empty keywords fall back to the default text.
const deckCardSchema = Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    meaning_up: Joi.string().trim().allow('').max(500).required(),
    meaning_rev: Joi.string().trim().allow('').max(500).required(),
    meaning_up_long: Joi.string().trim().min(1).max(10000).required(),
    meaning_rev_long: Joi.string().trim().min(1).max(10000).required(),
    desc: Joi.string().trim().min(1).max(10000).required()
})

const pageSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(25)
})

// STATS
adminRouter.get('/stats', async (req, res) => {
    try {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const [users, admins, readings, readingsLastWeek, topCards] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isAdmin: true }),
            Reading.countDocuments(),
            Reading.countDocuments({ timeStamp: { $gte: weekAgo } }),
            Reading.aggregate([
                { $unwind: '$cards' },
                { $group: { _id: '$cards.name_short', name: { $first: '$cards.name' }, count: { $sum: 1 } } },
                { $sort: { count: -1, name: 1 } },
                { $limit: 5 }
            ])
        ])
        return res.status(200).json({
            users,
            admins,
            readings,
            readingsLastWeek,
            topCards: topCards.map(({ _id, name, count }) => ({ name_short: _id, name, count }))
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to load stats.' })
    }
})

// USERS — with reading count and last reading date
adminRouter.get('/users', async (req, res) => {
    try {
        const [users, counts] = await Promise.all([
            User.find().select('-password').sort({ email: 1 }).lean(),
            Reading.aggregate([
                { $group: { _id: '$user', readingCount: { $sum: 1 }, lastReading: { $max: '$timeStamp' } } }
            ])
        ])
        const byUser = new Map(counts.map(c => [c._id.toString(), c]))
        return res.status(200).json(users.map(user => ({
            ...user,
            readingCount: byUser.get(user._id.toString())?.readingCount || 0,
            lastReading: byUser.get(user._id.toString())?.lastReading || null
        })))
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve users.' })
    }
})

// PROMOTE / DEMOTE a user (not yourself, so there is always at least one admin)
adminRouter.patch('/users/:_id/role', async (req, res) => {
    if (isSelf(req)) {
        return res.status(400).json({ errMsg: 'You cannot change your own admin status.' })
    }
    const { error, value } = roleSchema.validate(req.body, { stripUnknown: true })
    if (error) {
        return res.status(400).json({ errMsg: error.details[0].message })
    }
    try {
        const updated = await User.findByIdAndUpdate(req.params._id, { $set: { isAdmin: value.isAdmin } }, { returnDocument: 'after' })
            .select('-password')
        if (!updated) return res.status(404).json({ errMsg: 'User not found.' })
        return res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to update user.' })
    }
})

// DELETE a user and all of their readings (not yourself)
adminRouter.delete('/users/:_id', async (req, res) => {
    if (isSelf(req)) {
        return res.status(400).json({ errMsg: 'You cannot delete your own account here.' })
    }
    try {
        const deleted = await User.findByIdAndDelete(req.params._id)
        if (!deleted) return res.status(404).json({ errMsg: 'User not found.' })
        const { deletedCount } = await Reading.deleteMany({ user: req.params._id })
        return res.status(200).json({ message: `Deleted ${deleted.email} and ${deletedCount} reading(s).` })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to delete user.' })
    }
})

// ONE USER'S READINGS — newest first, paginated
adminRouter.get('/users/:_id/readings', async (req, res) => {
    const { error, value } = pageSchema.validate(req.query, { stripUnknown: true })
    if (error) {
        return res.status(400).json({ errMsg: error.details[0].message })
    }
    const { page, limit } = value
    const filter = { user: req.params._id }
    try {
        const [readings, total] = await Promise.all([
            Reading.find(filter)
                .sort({ timeStamp: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Reading.countDocuments(filter)
        ])
        return res.status(200).json({ readings, total, page, pages: Math.max(1, Math.ceil(total / limit)) })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve readings.' })
    }
})

// DELETE any reading
adminRouter.delete('/readings/:_id', async (req, res) => {
    try {
        const deleted = await Reading.findByIdAndDelete(req.params._id)
        if (!deleted) return res.status(404).json({ errMsg: 'Reading not found.' })
        return res.status(200).json({ message: 'Reading deleted.' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to delete reading.' })
    }
})

// EDIT a card's text
adminRouter.put('/cards/:_id', async (req, res) => {
    const { error, value: updates } = cardUpdateSchema.validate(req.body, { stripUnknown: true })
    if (error) {
        return res.status(400).json({ errMsg: error.details[0].message })
    }
    try {
        const updated = await Card.findByIdAndUpdate(req.params._id, { $set: updates }, { returnDocument: 'after', runValidators: true })
        if (!updated) return res.status(404).json({ errMsg: 'Card not found.' })
        return res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to update card.' })
    }
})

// GET a deck's content setting and the card text saved for it
adminRouter.get('/decks/:deck', async (req, res) => {
    try {
        const { deck } = req.params
        const [settings, cards] = await Promise.all([
            Deck.findOne({ deck }).lean(),
            DeckCard.find({ deck }).lean()
        ])
        return res.status(200).json({ deck, useDefaultContent: settings ? settings.useDefaultContent : true, cards })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to load deck.' })
    }
})

// SET whether a deck uses the default (Biddy Tarot) text
adminRouter.put('/decks/:deck', async (req, res) => {
    const { error, value } = deckSettingsSchema.validate(req.body, { stripUnknown: true })
    if (error) {
        return res.status(400).json({ errMsg: error.details[0].message })
    }
    try {
        const settings = await Deck.findOneAndUpdate(
            { deck: req.params.deck },
            { $set: value },
            { upsert: true, returnDocument: 'after', runValidators: true }
        ).lean()
        return res.status(200).json({ deck: settings.deck, useDefaultContent: settings.useDefaultContent })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to update deck.' })
    }
})

// SAVE a deck's own text for one card
adminRouter.put('/decks/:deck/cards/:_id', async (req, res) => {
    const { error, value } = deckCardSchema.validate(req.body, { stripUnknown: true })
    if (error) {
        return res.status(400).json({ errMsg: error.details[0].message })
    }
    try {
        if (!await Card.exists({ _id: req.params._id })) {
            return res.status(404).json({ errMsg: 'Card not found.' })
        }
        const saved = await DeckCard.findOneAndUpdate(
            { deck: req.params.deck, card: req.params._id },
            { $set: value },
            { upsert: true, returnDocument: 'after', runValidators: true }
        )
        return res.status(200).json(saved)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to save card.' })
    }
})

// REMOVE a deck's own text for one card (it goes back to the default)
adminRouter.delete('/decks/:deck/cards/:_id', async (req, res) => {
    try {
        await DeckCard.deleteOne({ deck: req.params.deck, card: req.params._id })
        return res.status(200).json({ message: 'Custom text removed.' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to remove custom text.' })
    }
})

module.exports = adminRouter
