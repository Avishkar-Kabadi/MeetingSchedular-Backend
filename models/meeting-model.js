const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
}, {
    timestamps: true
})



module.exports = mongoose.model('Meeting', meetingSchema);