const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    experience: {
        type: String,
        required: true,
        trim: true,
    },
    sold: {
        type: String,
        required: true,
        trim: true,
    },
    id_proof: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        default: "pending",
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('application', applicationSchema)