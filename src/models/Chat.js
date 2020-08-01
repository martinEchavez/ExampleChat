const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema({
    nick: { type: String, required: true},
    msg: { type: String },
    created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Chat', chatSchema);