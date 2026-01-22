const mongoose = require('mongoose');

const emergencyPostSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Police', 'Hospital', 'Rescue'], default: 'Police' },
    phone: { type: String, required: true },
    gps: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyPost', emergencyPostSchema);
