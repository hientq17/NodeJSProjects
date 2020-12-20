const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
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
    replyComment: {
        type: Array
    },
    status: {
        type: Boolean,
        default: true
    }
})

const CommentModel = new mongoose.model("comments", commentSchema);

module.exports = {
    commentSchema: commentSchema,
    CommentModel: CommentModel
}