// Restricts a route to admin users. Must run after requireAuth (server.js),
// which sets req.user from the verified JWT payload.
const requireAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ errMsg: 'Forbidden' })
    }
    next()
}

module.exports = requireAdmin
