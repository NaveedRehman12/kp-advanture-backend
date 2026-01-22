const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RegistrationOTP = require('../models/RegistrationOTP');
const sendEmail = require('../utils/sendEmail');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES });
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES });
    return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const user = await User.create({ name, email, password, phone });
        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.sendOtpRegister = async (req, res, next) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        console.log('Registration OTP requested for:', normalizedEmail);

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            console.log('Registration failed: User already exists:', normalizedEmail);
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const otp = generateOTP();

        await RegistrationOTP.deleteOne({ email }); // Clear invalid previous OTPs
        await RegistrationOTP.create({ email, otp });

        try {
            console.log('Attempting to send registration email to:', normalizedEmail);
            await sendEmail({
                email: normalizedEmail,
                subject: 'Tourism Platform Registration OTP',
                message: `Your OTP for registration is: ${otp}. It expires in 10 minutes.`,
            });
            console.log('Registration email sent successfully');
            res.json({ success: true, message: 'OTP sent to email' });
        } catch (err) {
            console.error('Email send failed (Expected if no SMTP Configured).');
            console.log('---------------------------------------------------');
            console.log('DEV MODE - YOUR REGISTRATION OTP IS:', otp);
            console.log('---------------------------------------------------');
            res.json({ success: true, message: 'OTP sent (stub)', devOtp: otp });
        }

    } catch (error) {
        next(error);
    }
};

exports.verifyOtpRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, otp } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const record = await RegistrationOTP.findOne({ email: normalizedEmail, otp });
        if (!record) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({ name, email: normalizedEmail, password, phone });
        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        await RegistrationOTP.deleteOne({ _id: record._id });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.sendOtpLogin = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log('Login OTP requested for:', email);
        // Case-insensitive lookup
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;

        try {
            await user.save();
        } catch (saveErr) {
            console.error('Failed to save OTP to user record:', saveErr);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        try {
            console.log('Attempting to send email to:', email);
            await sendEmail({
                email,
                subject: 'Tourism Platform Login OTP',
                message: `Your OTP for login is: ${otp}`,
            });
            console.log('Email sent successfully');
            res.json({ success: true, message: 'OTP sent' });
        } catch (err) {
            console.error('Email send failed (Expected if no SMTP Configured).');
            console.log('---------------------------------------------------');
            console.log('DEV MODE - YOUR LOGIN OTP IS:', otp);
            console.log('---------------------------------------------------');
            // STILL RETURN SUCCESS so the user can use the console OTP
            res.json({ success: true, message: 'OTP sent (Check Console)', devOtp: otp });
        }
    } catch (error) {
        next(error);
    }
};

exports.verifyOtpLogin = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({
            email: normalizedEmail,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.otp = undefined;
        user.otpExpires = undefined;

        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id);
            user.refreshToken = refreshToken;
            await user.save();
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken,
                    refreshToken
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const tokens = generateTokens(user._id);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json({ success: true, data: tokens });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Refresh token failed' });
    }
};

exports.logout = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.refreshToken = null;
        await user.save();
        res.json({ success: true, message: 'Logged out' });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    res.json({ success: true, data: req.user });
};

exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.emergencyPhone) user.emergencyPhone = req.body.emergencyPhone;
        if (req.body.homeAddress) user.homeAddress = req.body.homeAddress;
        if (req.body.city) user.city = req.body.city;

        if (req.file) {
            user.profileImage = req.file.path;
        }

        await user.save();

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                emergencyPhone: user.emergencyPhone,
                homeAddress: user.homeAddress,
                city: user.city,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.role === 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: 'Cannot delete super admin' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

exports.updateUserStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.role === 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: 'Cannot change super admin status' });
        }

        user.status = status;
        await user.save();
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');


        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message,
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }


        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        next(error);
    }
};
