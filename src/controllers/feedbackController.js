const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.create({
            userId: req.user._id,
            message: req.body.message
        });
        res.status(201).json({ success: true, data: feedback });
    } catch (error) {
        next(error);
    }
};

exports.getAdminFeedback = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find().populate('userId', 'name').sort({ createdAt: -1 });
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        next(error);
    }
};

exports.updateFeedbackStatus = async (req, res, next) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json({ success: true, data: feedback });
    } catch (error) {
        next(error);
    }
};

exports.deleteFeedback = async (req, res, next) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Feedback deleted' });
    } catch (error) {
        next(error);
    }
};
