const mongoose = require('mongoose')

const replyCommentSchema = new mongoose.Schema({
    author: {
        type: Object,
        default: "unknown"
    },
    content: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    status: {
        type: Boolean,
        default: true
    }
})

const ReplyCommentModel = new mongoose.model('replyComments', replyCommentSchema);

module.exports = {
    replyCommentSchema: replyCommentSchema,
    ReplyCommentModel: ReplyCommentModel
}