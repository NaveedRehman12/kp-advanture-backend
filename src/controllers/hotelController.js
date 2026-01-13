const Hotel = require('../models/Hotel');

exports.getHotels = async (req, res, next) => {
    try {
        const { search, sort } = req.query;
        let query = {};
        if (search) query.name = { $regex: search, $options: 'i' };

        let result = Hotel.find(query);
        if (sort === 'rating') result = result.sort({ avgRating: -1 });
        else result = result.sort({ createdAt: -1 });

        const hotels = await result;
        res.json({ success: true, data: hotels });
    } catch (error) {
        next(error);
    }
};

exports.getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
        res.json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

exports.createHotel = async (req, res, next) => {
    try {
        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        const hotel = await Hotel.create({ ...req.body, images, gps: req.body.gps ? JSON.parse(req.body.gps) : undefined });
        res.status(201).json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

exports.updateHotel = async (req, res, next) => {
    try {
        let updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(f => `/uploads/${f.filename}`);
        }
        if (req.body.gps) updateData.gps = JSON.parse(req.body.gps);

        const hotel = await Hotel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

exports.deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Hotel deleted' });
    } catch (error) {
        next(error);
    }
};
