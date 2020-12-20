const cloudinary = require('cloudinary').v2;
//Init
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

//Girl Model
const Girl = require('../model/girl')

const calculatePagination = async function calculatePagination(pageNum) {
    const girlList = await Girl.getGirlList();
    const pagination = {};
    const pageTotal = Math.ceil(girlList.length / 12);
    pagination.pageTotal = pageTotal;
    if (pageNum > pageTotal || pageNum < 1) pageNum = 1;
    pagination.pageNum = pageNum;
    if (pageNum == 1) pagination.prev = false;
    else pagination.prev = true;
    if (pageNum == pageTotal) pagination.next = false;
    else pagination.next = true;
    var start = (pageNum - 1) * 12;
    var end = pageNum * 12;
    if (pageNum * 12 > girlList.length - 1) end = girlList.length;
    const girls = girlList.slice(start, end);
    const result = {};
    result.pagination = pagination;
    result.girls = girls;
    return result;
}

router.get("/", async(req, res) => {
    const result = await calculatePagination(1);
    res.render("girl", { girls: result.girls, pagination: result.pagination });
})

router.get("/page:pageNum", async(req, res) => {
    const result = await calculatePagination(req.params.pageNum);
    res.render("girl", { girls: result.girls, pagination: result.pagination });
})

router.post("/new", async(req, res) => {
    const newGirl = req.body;
    if (!newGirl.girlName) newGirl.girlName = 'Unknown';
    try {
        await uploadGirl(newGirl);
        res.send(JSON.stringify("success"));
    } catch {
        res.send(JSON.stringify("fail"));
    }
})

const uploadGirl = async function uploadGirl(newGirl) {
    try {
        await cloudinary.uploader.upload(newGirl.base64, {
            resource_type: "image",
            use_filename: "true",
            folder: "girl"
        }, async function(error, result) {
            if (error) console.log(error)
            else {
                const girl = new Girl.GirlModel();
                girl.name = newGirl.girlName;
                girl.url = result.url;
                try {
                    await girl.save();
                    Girl.setGirlList(null);
                } catch (err) {
                    console.error(err);
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
}

//Export module
module.exports = router