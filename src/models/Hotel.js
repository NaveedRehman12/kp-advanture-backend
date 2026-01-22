const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    locationText: { type: String, required: true },
    gps: {
        lat: { type: Number },
        lng: { type: Number }
    },
    priceRange: { type: String },
    basePrice: { type: Number },
    contactPhone: { type: String, required: true },
    contactWhatsApp: { type: String },
    totalRooms: { type: Number, default: 0 },
    availableRooms: { type: Number, default: 0 },
    amenities: [{ type: String }],
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
