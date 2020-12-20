const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

//Contact Model
const Contact = require('../model/contact');

router.get('/', async function(req, res) {
    const contact = await Contact.getContact();
    res.render('about', { contact: contact });
})

module.exports = router;