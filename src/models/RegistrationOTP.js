const mongoose = require('mongoose');

const registrationOTPSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: () => Date.now() + 10 * 60 * 1000 } // 10 mins
}, { timestamps: true });

registrationOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RegistrationOTP', registrationOTPSchema);
