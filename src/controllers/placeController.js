const Place = require('../models/Place');

exports.getPlaces = async (req, res, next) => {
    try {
        const { search, category, sort } = req.query;
        let query = {};
        if (search) query.name = { $regex: search, $options: 'i' };
        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        let result = Place.find(query);
        if (sort === 'rating') result = result.sort({ avgRating: -1 });
        else result = result.sort({ createdAt: -1 });

        const places = await result;
        res.json({ success: true, data: places });
    } catch (error) {
        next(error);
    }
};

exports.getPlace = async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
        res.json({ success: true, data: place });
    } catch (error) {
        next(error);
    }
};

exports.createPlace = async (req, res, next) => {
    try {
        const images = req.files ? req.files.map(f => f.path) : [];
        const place = await Place.create({ ...req.body, images, gps: JSON.parse(req.body.gps) });
        res.status(201).json({ success: true, data: place });
    } catch (error) {
        next(error);
    }
};

exports.updatePlace = async (req, res, next) => {
    try {
        let updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(f => f.path);
        }
        if (req.body.gps) updateData.gps = JSON.parse(req.body.gps);

        const place = await Place.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, data: place });
    } catch (error) {
        next(error);
    }
};

exports.deletePlace = async (req, res, next) => {
    try {
        await Place.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Place deleted' });
    } catch (error) {
        next(error);
    }
};
