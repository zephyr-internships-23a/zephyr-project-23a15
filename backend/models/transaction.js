const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'property'
    },
    price: {
        type: Number,
        required: true
    },
    payment_id: {
        type: String
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('transaction', transactionSchema)