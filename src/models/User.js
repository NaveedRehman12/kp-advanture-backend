const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    emergencyPhone: { type: String },
    homeAddress: { type: String },
    city: { type: String },
    role: {
        type: String,
        enum: ['USER', 'SUPER_ADMIN', 'HOTEL_MANAGER', 'JEEP_MANAGER', 'LOCATION_MANAGER', 'REVIEW_MODERATOR'],
        default: 'USER'
    },
    emergencyContacts: [{
        name: String,
        phone: String
    }],
    profileImage: { type: String },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED'],
        default: 'ACTIVE'
    },
    refreshToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
