const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: new Date()
    }
})

const MessageModel = new mongoose.model("messages", messageSchema);

module.exports = {
    MessageModel: MessageModel
}