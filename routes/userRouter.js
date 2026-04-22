const express = require('express')
const userRouter = express.Router()
const User = require('../models/User.js')

// Get All Users
userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve users.' })
    }
})

// Get User Profile
userRouter.get('/:_id', async (req, res) => {
    try {
        const user = await User.findById(req.params._id)
        if (!user) return res.status(404).json({ errMsg: 'User not found.' })
        return res.status(200).json(user)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to retrieve user.' })
    }
})

// Update User Profile
userRouter.put('/:_id', async (req, res) => {
    try {
        if (req.body.email) {
            const conflict = await User.findOne({ email: req.body.email.toLowerCase() })
            if (conflict && conflict._id.toString() !== req.params._id) {
                return res.status(409).json({ errMsg: 'That email address is already in use.' })
            }
        }
        const updated = await User.findByIdAndUpdate(req.params._id, req.body, { new: true })
        return res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Failed to update user.' })
    }
})

module.exports = userRouter
