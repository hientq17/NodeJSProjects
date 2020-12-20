const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

//Contact Model
const Contact = require('../model/contact');
//Message Model
const Message = require('../model/message');

router.get('/', async function(req, res) {
    const contact = await Contact.getContact();
    res.render('contact', { contact: contact });
})

router.post('/send-message', async function(req, res) {
    const message = new Message.MessageModel();
    message.name = req.body.name;
    message.email = req.body.email;
    message.content = req.body.content;
    message.phone = req.body.phone;
    try {
        await message.save();
        res.send(JSON.stringify('success'));
    } catch (err) {
        console.error(err);
        res.send(JSON.stringify('fail'));
    }
})

module.exports = router;