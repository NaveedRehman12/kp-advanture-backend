const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['BROADCAST', 'PERSONAL', 'ALERT', 'SYSTEM'],
        default: 'BROADCAST'
    },
    isRead: { type: Boolean, default: false },
    data: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
