const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    placeName: { type: String, required: true },
    lastSeenLocationText: { type: String, required: true },
    gps: {
        lat: { type: Number },
        lng: { type: Number }
    },
    status: {
        type: String,
        enum: ['LOST', 'FOUND'],
        default: 'LOST'
    }
}, { timestamps: true });

module.exports = mongoose.model('LostFound', lostFoundSchema);
