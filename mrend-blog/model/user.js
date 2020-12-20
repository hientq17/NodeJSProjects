const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('users', schema)