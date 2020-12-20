//Init
const express = require('express')
const router = express.Router()

//User Model
const User = require('../model/user')

router.get('/', async(req, res) => {
    await User.find((err, result) => {
        if (err) console.log(err);
        else {
            console.log(result)
            console.log("Find successfully")
        }
    })
    res.render('index')
})

//Export module
module.exports = router