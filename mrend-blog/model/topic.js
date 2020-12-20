const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

const TopicModel = mongoose.model('topics', topicSchema);

var topicList = null;

const getTopicList = async function getTopicList() {
    try {
        if (topicList == null) topicList = await TopicModel.find({ status: true });
    } catch (err) {
        console.error(err);
    }
    return topicList;
}

const getTopicListWithPostQuantity = async function getTopicListWithPostQuantity() {
    await getTopicList();
    var topics = [];
    const Post = require('../model/post');
    for (i = 0; i < topicList.length; i++) {
        const posts = await Post.getPostListByTopic(topicList[i].id);
        topics.push({ topic: topicList[i], postQuantity: posts.length });
    }
    return topics;
}

const getTopicByName = async function getTopicByName(name) {
    await getTopicList();
    var topic = null;
    topicList.forEach(t => {
        if (t.name == name) {
            topic = t;
            return;
        }
    })
    return topic;
}

module.exports = {
    TopicModel: TopicModel,
    topicSchema: topicSchema,
    getTopicList: getTopicList,
    getTopicByName: getTopicByName,
    getTopicListWithPostQuantity: getTopicListWithPostQuantity
}