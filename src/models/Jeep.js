const mongoose = require('mongoose');

const jeepSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    locationText: { type: String, required: true },
    gps: {
        lat: { type: Number },
        lng: { type: Number }
    },
    ratePerDay: { type: Number, required: true },
    seats: { type: Number, required: true },
    model: { type: String },
    driverIncluded: { type: Boolean, default: true },
    driver: {
        name: { type: String },
        phone: { type: String },
        image: { type: String },
        cnic: { type: String },
        bio: { type: String }
    },
    features: [{ type: String }],
    contactPhone: { type: String, required: false },
    contactWhatsApp: { type: String },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Jeep', jeepSchema);
