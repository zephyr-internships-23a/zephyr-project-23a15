const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
    user_one: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    user_two: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    messages: [
        {
            user_id: mongoose.Schema.Types.ObjectId,
            message: String
        }
    ]

}, {
    timestamps: true
})

module.exports = mongoose.model('chat', chatSchema)