//Init
const express = require('express')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary').v2;
const router = express.Router()
const moment = require('moment');
moment.locale('vi'); //set the location VietNam
//convert datetime to string
//console.log(moment(new Date()).format('DD-MM-YYYY HH:mm:ss'));
//calculate from now
//console.log(moment(new Date()).fromNow());

router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

//Post Model
const Post = require('../model/post');
//Topic Model
const Topic = require('../model/topic');
//Comment Model
const Comment = require('../model/comment');
//ReplyComment Model
const ReplyComment = require('../model/replyComment');

const calculatePagination = async function calculatePagination(pageNum, topic) {
    var postList = null;
    if (topic) postList = await Post.getPostListByTopic(topic);
    else postList = await Post.getPostList();
    const pagination = {};
    const pageTotal = Math.ceil(postList.length / 8);
    pagination.pageTotal = pageTotal;
    if (pageNum > pageTotal || pageNum < 1) pageNum = 1;
    pagination.pageNum = pageNum;
    if (pageNum == 1) pagination.prev = false;
    else pagination.prev = true;
    if (pageNum == pageTotal) pagination.next = false;
    else pagination.next = true;
    var start = (pageNum - 1) * 8;
    var end = pageNum * 8;
    if (pageNum * 8 > postList.length - 1) end = postList.length;
    const posts = postList.slice(start, end);
    const result = {};
    result.pagination = pagination;
    result.posts = posts;
    return result;
}

router.get("/", async(req, res) => {
    const result = await calculatePagination(1);
    const recentPosts = await Post.getRecentPostList();
    const popularPosts = await Post.getPopularPostList();
    const topics = await Topic.getTopicListWithPostQuantity();
    res.render("blog", { posts: result.posts, topics: topics, recentPosts: recentPosts, popularPosts: popularPosts, pagination: result.pagination });
})

router.get("/topic/:topicId", async(req, res) => {
    const result = await calculatePagination(1, req.params.topicId);
    const recentPosts = await Post.getRecentPostList();
    const popularPosts = await Post.getPopularPostList();
    const topics = await Topic.getTopicListWithPostQuantity();
    res.render("blog", { posts: result.posts, topics: topics, recentPosts: recentPosts, popularPosts: popularPosts, pagination: result.pagination });
})

router.get("/page:pageNum", async(req, res) => {
    const result = await calculatePagination(req.params.pageNum);
    const recentPosts = await Post.getRecentPostList();
    const popularPosts = await Post.getPopularPostList();
    const topics = await Topic.getTopicListWithPostQuantity();
    res.render("blog", { posts: result.posts, topics: topics, recentPosts: recentPosts, popularPosts: popularPosts, pagination: result.pagination });
})

router.get("/post/:id", async(req, res) => {
    const postId = req.params.id;
    await Post.increaseView(postId);
    const post = await Post.getPostById(postId);
    const recentPosts = await Post.getRecentPostList();
    const popularPosts = await Post.getPopularPostList();
    const relatedPosts = await Post.getRelatedPostList(postId);
    const topics = await Topic.getTopicListWithPostQuantity();
    res.render("single", { post: post, topics: topics, recentPosts: recentPosts, popularPosts: popularPosts, relatedPosts: relatedPosts });
})


router.get('/new', async(req, res) => {
    const topics = await Topic.getTopicList();
    res.render('newPost', { topics: topics });
})

router.post('/new', async(req, res) => {
    const post = new Post.PostModel();
    post.title = req.body.title;
    post.description = req.body.description;
    post.content = req.body.content;
    post.thumbnail = req.body.thumbnail;
    const topic = await Topic.getTopicByName(req.body.topic);
    post.topic = topic;
    console.log(post);
    try {
        await post.save();
        Post.setPostList(null);
    } catch (error) {
        console.error(error);
    }
    res.redirect("/blog")
})

router.get('/editPost/:id', async(req, res) => {
    const postId = req.params.id;
    const post = await Post.getPostById(postId);
    const topics = await Topic.getTopicList();
    res.render("editPost", { post: post, topics: topics });
})

router.post('/editPost/:id', async(req, res) => {
    const postId = req.params.id;
    const post = new Post.PostModel();
    post.title = req.body.title;
    post.description = req.body.description;
    post.content = req.body.content;
    post.thumbnail = req.body.thumbnail;
    const topic = await Topic.getTopicByName(req.body.topic);
    post.topic = topic;
    console.log(post);
    try {
        await Post.PostModel.updateOne({ _id: postId }, { title: post.title, description: post.description, content: post.content, thumbnail: post.thumbnail, topic: post.topic });
    } catch (error) {
        console.error(error);
    }
    Post.setPostList(null);
    res.redirect("/blog")
})

router.post('/send-comment', async(req, res) => {
    const postId = req.body.postId;
    const comment = new Comment.CommentModel();
    comment.author = {
        name: req.body.authorName,
        email: req.body.authorEmail
    }
    comment.content = req.body.content;
    try {
        await Post.PostModel.updateOne({ _id: postId }, { "$push": { comment: comment } });
        Post.setPostList(null);
        res.send(JSON.stringify(comment));
    } catch (error) {
        console.error(error);
        res.send(JSON.stringify('fail'));
    }
})

router.post('/send-reply-comment', async(req, res) => {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const replyComment = new ReplyComment.ReplyCommentModel();
    replyComment.author = {
        name: req.body.authorName,
        email: req.body.authorEmail
    }
    replyComment.content = req.body.content;
    try {
        await Post.insertReplyComment(postId, commentId, replyComment);
        res.send(JSON.stringify(replyComment));
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify('fail'));
    }
})

router.post("/insertImage", async(req, res) => {
    const img = req.body;
    const url = await uploadImage(img.url);
    res.send(JSON.stringify(url));
})

router.post("/deleteImage", async(req, res) => {
    const img = req.body;
    //get public id based on url
    const strArr = img.url.split("/");
    const length = strArr.length;
    const strArr1 = strArr[length - 1].split(".");
    var url = strArr[length - 2] + "/" + strArr1[0];
    console.log(url);
    const result = await deleteImage(url);
    res.send(JSON.stringify(result));
})

const uploadImage = async function uploadImage(base64) {
    var result = await cloudinary.uploader.upload(base64, {
        resource_type: "image",
        use_filename: "true",
        folder: "blog"
    }, async function(error, result) {
        if (error) console.log(error)
        else {
            // console.log(result)
        }
    });
    return result.url;
}

const deleteImage = async function deleteImage(publicId) {
    return await cloudinary.uploader.destroy(publicId, async function(error, result) {
        if (error) console.log(error)
        else {
            console.log(result)
        }
    });
}

//Export module
module.exports = router