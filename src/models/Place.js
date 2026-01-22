const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    gps: {
        lat: { type: Number, required: false },
        lng: { type: Number, required: false }
    },
    locationText: { type: String, required: true },
    category: { type: String },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    safetyTips: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);
