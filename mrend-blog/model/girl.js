const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        default: 'unknow'
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: (new Date()).toLocaleDateString()
    },
    status: {
        type: Boolean,
        default: true
    }
})

const GirlModel = mongoose.model('images', schema);

var girlList = null;

const getGirlList = async function getGirlList() {
    if (girlList == null) {
        console.log('null');
        try {
            girlList = await GirlModel.find({ status: true });
        } catch (err) {
            console.error(err);
        }
    }
    return girlList;
}

const setGirlList = async function setGirlList(value) {
    girlList = value;
}

module.exports = {
    GirlModel: GirlModel,
    getGirlList: getGirlList,
    setGirlList: setGirlList
}