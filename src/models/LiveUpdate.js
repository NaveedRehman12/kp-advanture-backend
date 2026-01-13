const mongoose = require('mongoose');

const liveUpdateSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['WEATHER', 'TRAFFIC'],
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, default: 'General' },
    severity: {
        type: String,
        enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
        default: 'MODERATE'
    },
    isActive: { type: Boolean, default: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('LiveUpdate', liveUpdateSchema);
