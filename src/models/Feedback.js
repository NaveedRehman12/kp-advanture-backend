const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['OPEN', 'RESOLVED'],
        default: 'OPEN'
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
