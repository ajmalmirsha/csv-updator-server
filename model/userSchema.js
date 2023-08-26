
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default : ''
    },
    userType: {
        type: String,
        default : ''
    },
    company_name: {
        type: String,
        default : ''
    },
    category_name: {
        type: String,
        default : ''
    },
    csr: {
        type: String,
        default : ''
    },
    email: {
        type: String,
        default : ''
    },
    city: {
        type: String,
        default : ''
    },
    phone: {
        type: String,
        default : ''
    },
    address: {
        type: String,
        default : ''
    },
    state: {
        type: String,
        default : ''
    },
    zip: {
        type: String,
        default : ''
    },
    dob: {
        type: String,
        default : ''
    },
    producer: {
        type: String,
        default : ''
    },
    fileName: {
        type: String,
        default : ''
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agent",
    },
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "policy",
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
    },
},{timestamps:true})


module.exports = mongoose.model('users',userSchema)