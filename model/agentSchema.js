

const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
    agent: {
        type: String,
    }
},{timestamps:true})

module.exports = mongoose.model('agent',agentSchema)