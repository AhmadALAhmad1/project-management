//Db , on top of it mongoose layer, on top of it graphql layer
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
})


module.exports = mongoose.model('Client', ClientSchema);