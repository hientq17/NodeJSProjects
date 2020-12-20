const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    cv: {
        type: String,
        require: true
    }
})

const ContactModel = mongoose.model('contacts', contactSchema);

var contact = null;

const getContact = async function getContact() {
    try {
        if (contact == null) contact = await ContactModel.findOne({});
    } catch (err) {
        console.error(err);
    }
    return contact;
}

module.exports = {
    ContactModel: ContactModel,
    getContact: getContact
}