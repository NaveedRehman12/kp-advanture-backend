const LiveUpdate = require('../models/LiveUpdate');

exports.getLiveUpdates = async (req, res, next) => {
    try {
        const { type, active } = req.query;
        let query = {};
        if (type) query.type = type.toUpperCase();
        if (active === 'true') query.isActive = true;

        const updates = await LiveUpdate.find(query).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: updates.length, data: updates });
    } catch (error) {
        next(error);
    }
};

exports.createLiveUpdate = async (req, res, next) => {
    try {
        const update = await LiveUpdate.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json({ success: true, data: update });
    } catch (error) {
        next(error);
    }
};

exports.updateLiveUpdate = async (req, res, next) => {
    try {
        let update = await LiveUpdate.findById(req.params.id);
        if (!update) {
            return res.status(404).json({ success: false, message: 'Update not found' });
        }

        update = await LiveUpdate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: update });
    } catch (error) {
        next(error);
    }
};

exports.deleteLiveUpdate = async (req, res, next) => {
    try {
        const update = await LiveUpdate.findById(req.params.id);
        if (!update) {
            return res.status(404).json({ success: false, message: 'Update not found' });
        }

        await update.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
