const express = require('express')
const authRouter = express.Router()
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const Joi = require('joi')
const User = require('../models/User.js')

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { errMsg: 'Too many attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
})

const signupSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().max(50).optional().allow(''),
    lastName: Joi.string().max(50).optional().allow('')
})

const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required()
})

// Signup - POST
authRouter.post('/signup', authLimiter, async (req, res) => {
    const { error } = signupSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ errMsg: error.details[0].message })
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email.toLowerCase() })
        if (existingUser) {
            return res.status(409).json({ errMsg: 'That email address is already in use.' })
        }

        const newUser = new User({ ...req.body, username: req.body.email.toLowerCase() })
        const savedUser = await newUser.save()
        const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET, { expiresIn: '7d' })
        return res.status(201).json({ user: savedUser.withoutPassword(), token })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Signup failed. Please try again.' })
    }
})

// Login - POST
authRouter.post('/login', authLimiter, async (req, res) => {
    const { error } = loginSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ errMsg: error.details[0].message })
    }

    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() })
        if (!user) {
            return res.status(401).json({ errMsg: 'Email or password incorrect.' })
        }

        const isMatch = await user.checkPassword(req.body.password)
        if (!isMatch) {
            return res.status(401).json({ errMsg: 'Email or password incorrect.' })
        }

        const token = jwt.sign(user.withoutPassword(), process.env.SECRET, { expiresIn: '7d' })
        return res.status(200).json({ user: user.withoutPassword(), token })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ errMsg: 'Login failed. Please try again.' })
    }
})

module.exports = authRouter
