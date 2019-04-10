const express = require('express')
const userRouter = express.Router()
const User = require('../models/user.js')

// Get All Users
userRouter.get("/", (req, res, next) => {
    // Find user by that username - returns (err, user)
    User.find((err, foundUsers) => {
        if (err) {
            res.status(500)
            return next(err)
        }

        // Does that user exist - returns err "User not found."
        if (!foundUsers) {
            res.status(403)
            return next(new Error("No users in the database."))
        }

        // Send Response
        return res.status(200).send(foundUsers)
    })
})

// Get User Profile
userRouter.get("/:_id", (req, res, next) => {
    // Find user by that username - returns (err, user)
    User.findOne({ _id: req.params._id }, (err, foundUser) => {
        if (err) {
            res.status(500)
            return next(err)
        }

        // Does that user exist - returns err "User not found."
        if (!foundUser) {
            res.status(403)
            return next(new Error("User not found."))
        }

        // Send Response
        return res.status(200).send(foundUser)
    })
})

// Update User Profile
userRouter.put('/:_id', (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params._id },
        req.body,
        { new: true },
        (err, updatedUser) => {
            if (err) {
                res.status(500)
                return res.send(err)
            }
            return res.status(201).send(updatedUser)
        })
})

module.exports = userRouter