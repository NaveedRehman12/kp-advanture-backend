const LostFound = require('../models/LostFound');

exports.createLostFound = async (req, res, next) => {
    try {
        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        const lostFound = await LostFound.create({
            ...req.body,
            userId: req.user._id,
            images,
            gps: req.body.gps ? JSON.parse(req.body.gps) : undefined
        });
        res.status(201).json({ success: true, data: lostFound });
    } catch (error) {
        next(error);
    }
};

exports.getLostFounds = async (req, res, next) => {
    try {
        const { status, own } = req.query;
        let query = {};
        if (status) query.status = status;
        if (own === 'true') query.userId = req.user._id;

        const results = await LostFound.find(query).populate('userId', 'name').sort({ createdAt: -1 });
        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

exports.getAdminLostFounds = async (req, res, next) => {
    try {
        const results = await LostFound.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

exports.getLostFoundById = async (req, res, next) => {
    try {
        const result = await LostFound.findById(req.params.id).populate('userId', 'name email phone');
        if (!result) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

exports.updateLostFoundStatus = async (req, res, next) => {
    try {
        const lostFound = await LostFound.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json({ success: true, data: lostFound });
    } catch (error) {
        next(error);
    }
};
