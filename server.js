require('dotenv').config()

// Validate required environment variables before anything else
const requiredEnvVars = ['MONGODB_URI', 'SECRET']
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v])
if (missingEnvVars.length > 0) {
    console.error(`[!] Missing required environment variables: ${missingEnvVars.join(', ')}`)
    console.error('[!] Copy .env.example to .env and fill in the values.')
    process.exit(1)
}

const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')

const PORT = process.env.PORT || 7000

// Trust proxy (needed for rate limiter when behind a proxy/dev server)
app.set('trust proxy', 1)

// Security headers
app.use(helmet())

// CORS
app.use(cors())

// Request logging
app.use(morgan('dev'))

// Body parsing
app.use(express.json())

// Serve static React build
app.use(express.static(path.join(__dirname, 'client', 'build')))

// DB Connect
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[o] Connected to the DB'))
    .catch(err => {
        console.error('[!] DB connection failed:', err.message)
        process.exit(1)
    })

// JWT Authentication middleware for /api routes
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ errMsg: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    try {
        req.user = jwt.verify(token, process.env.SECRET)
        next()
    } catch {
        return res.status(401).json({ errMsg: 'Unauthorized' })
    }
}

// ROUTES
// Public
app.use('/auth', require('./routes/authRouter.js'))

// Private (all /api/* routes require a valid JWT)
app.use('/api', requireAuth)
app.use('/api/cards', require('./routes/cardRouter.js'))
app.use('/api/readings', require('./routes/readingRouter.js'))
app.use('/api/users', require('./routes/userRouter.js'))

// React catch-all (serve index.html for any non-API route)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

// Global error handler
app.use((err, req, res, next) => {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ errMsg: 'An error occurred.' })
})

app.listen(PORT, () => {
    console.log(`[o] Server is running on Port ${PORT}`)
})
