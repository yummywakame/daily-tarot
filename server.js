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
const APP_BASE = (process.env.APP_BASE || '').replace(/\/$/, '')

// Trust proxy (needed for rate limiter when behind a proxy/dev server)
app.set('trust proxy', 1)

// Security headers — CSP must allow: Font Awesome (index.html), Google Fonts (@import in main.css)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://use.fontawesome.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', 'blob:'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://use.fontawesome.com'],
            connectSrc: ["'self'"],
        },
    },
}))

// CORS
app.use(cors())

// Request logging
app.use(morgan('dev'))

// Body parsing
app.use(express.json())

const STATIC_DIR = path.join(__dirname, 'client', 'build')
const indexHtml = path.join(STATIC_DIR, 'index.html')
const staticMw = express.static(STATIC_DIR)

if (APP_BASE) {
    app.use(APP_BASE + '/', staticMw)
} else {
    app.use(staticMw)
}

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

const authRouter = require('./routes/authRouter.js')
const cardRouter = require('./routes/cardRouter.js')
const readingRouter = require('./routes/readingRouter.js')
const userRouter = require('./routes/userRouter.js')

// ROUTES
const authMount = APP_BASE ? APP_BASE + '/auth' : '/auth'
const apiMount = APP_BASE ? APP_BASE + '/api' : '/api'

app.use(authMount, authRouter)
app.use(apiMount, requireAuth)
app.use(apiMount + '/cards', cardRouter)
app.use(apiMount + '/readings', readingRouter)
app.use(apiMount + '/users', userRouter)

const sendSpa = (req, res) => {
    res.sendFile(indexHtml)
}

if (APP_BASE) {
    app.get(APP_BASE, sendSpa)
    app.get(APP_BASE + '/', sendSpa)
    app.get(APP_BASE + '/*', sendSpa)
} else {
    app.get('*', sendSpa)
}

// Global error handler
app.use((err, req, res, next) => {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ errMsg: 'An error occurred.' })
})

app.listen(PORT, () => {
    console.log(`[o] Server is running on Port ${PORT}`)
    if (APP_BASE) {
        console.log(`[o] App base path: ${APP_BASE}`)
    }
})
