const express = require('express')
const userRouter = express.Router()
const Joi = require('joi')
const User = require('../models/User.js')
const requireAdmin = require('../middleware/requireAdmin.js')

// Only these fields can be changed through the profile update route.
// password, isAdmin and username are intentionally excluded; unknown keys are stripped.
const updateSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }),
    firstName: Joi.string().max(50).allow(''),
    lastName: Joi.string().max(50).allow(''),
    allowRev: Joi.boolean(),
    deck: Joi.string().valid(...User.schema.path('deck').enumValues)
})

const isSelf = (req) => req.params._id === req.user._id

// Get All Users (admin only)
userRouter.get('/', requireAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password')
        return res.status(200).json(users)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve users.' })
    }
})

// Get User Profile (self or admin)
userRouter.get('/:_id', async (req, res) => {
    if (!isSelf(req) && !req.user.isAdmin) {
        return res.status(403).json({ errMsg: 'Forbidden' })
    }
    try {
        const user = await User.findById(req.params._id).select('-password')
        if (!user) return res.status(404).json({ errMsg: 'User not found.' })
        return res.status(200).json(user)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve user.' })
    }
})

// Update User Profile (self only)
userRouter.put('/:_id', async (req, res) => {
    if (!isSelf(req)) {
        return res.status(403).json({ errMsg: 'Forbidden' })
    }

    const { error, value: updates } = updateSchema.validate(req.body, { stripUnknown: true })
    if (error) {
        return res.status(400).json({ errMsg: error.details[0].message })
    }

    try {
        if (updates.email) {
            const conflict = await User.findOne({ email: updates.email.toLowerCase() })
            if (conflict && conflict._id.toString() !== req.params._id) {
                return res.status(409).json({ errMsg: 'That email address is already in use.' })
            }
        }
        const updated = await User.findByIdAndUpdate(req.params._id, updates, { returnDocument: 'after', runValidators: true })
            .select('-password')
        if (!updated) return res.status(404).json({ errMsg: 'User not found.' })
        return res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to update user.' })
    }
})

module.exports = userRouter
