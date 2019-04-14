const express = require('express')
const app = express()
require('dotenv').config()

const morgan = require('morgan')
const mongoose = require('mongoose')
const expressJwt = require('express-jwt')
const PORT = process.env.PORT || 7000
// ... other imports 
const path = require("path")

// Middlewares for every request
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, "client", "build")))


// DB Connect
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tarot', { "useNewUrlParser": true }, () => {
    console.log("[o] Connected to the DB")
})

// Security Checkpoint - checking to see if the secret in the JWT matches our env secret
// app.use("/user", expressJwt({secret: process.env.SECRET})) // req.user


// ROUTES
// Public
app.use("/auth", require("./routes/authRouter.js"))

// Private
app.use("/api", expressJwt({ secret: process.env.SECRET })) // all /api/ urls check if authenticated
app.use("/api/cards", require('./routes/cardRouter.js'))
app.use("/api/readings", require('./routes/readingRouter.js'))
app.use("/api/users", require('./routes/userRouter.js'))

// Global Server Error Handler
app.use((err, req, res, next) => {
    console.error(err)
    if (err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    return res.send({ errMsg: err.message })
})

// Server Listen (activates the server)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
})
app.listen(PORT, () => {
    console.log(`[o] Server is running on Port ${PORT}`)
})