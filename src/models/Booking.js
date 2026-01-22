const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entityType: { type: String, enum: ['HOTEL', 'JEEP'], required: true }, // 'HOTEL' or 'JEEP'
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'entityModel' },
    entityModel: { type: String, required: true, enum: ['Hotel', 'Jeep'] }, // Dynamic ref

    // Common fields
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], default: 'PENDING' },
    totalPrice: { type: Number },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },

    // Hotel Specific
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
    guests: {
        adults: { type: Number },
        children: { type: Number }
    },

    // Jeep Specific
    pickupDate: { type: Date },
    pickupLocation: { type: String },
    dropoffLocation: { type: String },
    passengers: { type: Number },

    customerName: { type: String },
    customerPhone: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
