const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    username: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters']
    },
    firstName: String,
    lastName: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    allowRev: {
        type: Boolean,
        default: false
    }
})

// Pre-save hook for password encryption
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    try {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    } catch (err) {
        next(err)
    }
})

// checkPassword - returns Promise<boolean>
userSchema.methods.checkPassword = function (passwordAttempt) {
    return bcrypt.compare(passwordAttempt, this.password)
}

// Strip password from user object
userSchema.methods.withoutPassword = function () {
    const user = this.toObject()
    delete user.password
    return user
}

module.exports = mongoose.model('User', userSchema)
