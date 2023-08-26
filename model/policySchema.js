
const mongoose = require('mongoose')


const policySchema = new mongoose.Schema({
    policy_mode: {
        type: String,
    },
    policy_number: {
        type: String,
    },
    policy_type: {
        type: String,
    },
    policy_start_date: {
        type: String,
    },
    policy_end_date: {
        type: String,
    }
},{timestamps:true})


module.exports = mongoose.model('policy',policySchema)