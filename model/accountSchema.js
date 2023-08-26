

const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    premium_amount: {
        type: String,
    },
    account_name: {
        type: String,
    },
    account_type: {
        type: String,
    }
},{timestamps:true})

module.exports = mongoose.model('account',accountSchema)