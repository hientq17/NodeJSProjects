const mongoose = require('mongoose')
const __ = require('lodash')
const Topic = require('../model/topic');

const Comment = require('../model/comment');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    thumbnail: {
        type: String,
        require: true
    },
    topic: {
        type: Topic.topicSchema,
        require: true
    },
    date: {
        type: Date,
        default: (new Date())
    },
    author: {
        type: String,
        default: "Mrend"
    },
    comment: {
        type: Array
    },
    view: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
})

const PostModel = mongoose.model('posts', postSchema);

var postList = null;

const getPostList = async function getPostList() {
    try {
        if (postList == null) postList = await PostModel.find({ status: true });
    } catch (error) {
        console.error(error);
    }
    return postList;
}

const setPostList = function setPostList(value) {
    postList = value;
}

const recentPostsSort = (array) => {
    let isOrdered;
    for (let i = 0; i < array.length; i++) {
        isOrdered = true;
        for (let x = 0; x < array.length - 1 - i; x++) {
            if (array[x].id < array[x + 1].id) {
                [array[x], array[x + 1]] = [array[x + 1], array[x]];
                isOrdered = false;
            }
        }
        if (isOrdered) break;
    }
    return array;
}

const popularPostsSort = (array) => {
    let isOrdered;
    for (let i = 0; i < array.length; i++) {
        isOrdered = true;
        for (let x = 0; x < array.length - 1 - i; x++) {
            if (array[x].view < array[x + 1].view) {
                [array[x], array[x + 1]] = [array[x + 1], array[x]];
                isOrdered = false;
            }
        }
        if (isOrdered) break;
    }
    return array;
}

const getRecentPostList = async function getRecentPostList() {
    await getPostList();
    var recentPostList = recentPostsSort(postList).slice(0, 3);
    return recentPostList;
}

const getPopularPostList = async function getPopularPostList() {
    await getPostList();
    var popularPostList = popularPostsSort(postList).slice(0, 3);
    return popularPostList;
}

const getPostById = async function getPostById(postId) {
    await getPostList();
    var post;
    postList.forEach(p => {
        if (p.id == postId) {
            post = p;
            return;
        }
    })
    return post;
}

const getPostListByTopic = async function getPostListByTopic(topicId) {
    await getPostList();
    const postListByTopic = [];
    postList.forEach(p => {
        if (__.lowerCase(p.topic.id) == __.lowerCase(topicId)) {
            postListByTopic.push(p);
        }
    })
    return postListByTopic;
}

//get to related post with fewest view
const getRelatedPostList = async function getRelatedPostList(postId) {
    await getPostList();
    var relatedPostList = [];
    postList.forEach(post => {
        if (post.id != postId) {
            relatedPostList.push(post);
        }
    })
    var relatedPostList = popularPostsSort(relatedPostList);
    const length = relatedPostList.length;
    if (length > 2) relatedPostList = relatedPostList.slice(length - 3, length - 1);
    return relatedPostList;
}

const insertReplyComment = async function insertReplyComment(postId, commentId, replyComment) {
    const commentArr = (await getPostById(postId)).comment;
    for (i = 0; i < commentArr.length; i++) {
        if (commentArr[i]._id == commentId) {
            commentArr[i].replyComment.push(replyComment);
            break;
        }
    }
    try {
        await PostModel.updateOne({ _id: postId }, { comment: commentArr });
        setPostList(null);
    } catch (error) {
        console.error(error);
    }
}

const increaseView = async function increaseView(postId) {
    await getPostList();
    var view = 0;
    for (i = 0; i < postList.length; i++) {
        if (postList[i].id == postId) {
            postList[i].view += 1;
            view = postList[i].view;
            break;
        }
    }
    try {
        await PostModel.updateOne({ _id: postId }, { view: view })
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    PostModel: PostModel,
    getPostList: getPostList,
    setPostList: setPostList,
    getRecentPostList: getRecentPostList,
    getPopularPostList: getPopularPostList,
    getPostById: getPostById,
    getPostListByTopic: getPostListByTopic,
    insertReplyComment: insertReplyComment,
    getRelatedPostList: getRelatedPostList,
    increaseView: increaseView
}