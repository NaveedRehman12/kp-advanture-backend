const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    entityType: {
        type: String,
        enum: ['PLACE', 'HOTEL', 'JEEP', 'APP'],
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function () { return this.entityType !== 'APP'; },
        refPath: 'entityType'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'APPROVED'
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
