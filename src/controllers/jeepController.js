const Jeep = require('../models/Jeep');

exports.getJeeps = async (req, res, next) => {
    try {
        const { search, sort } = req.query;
        let query = {};
        if (search) query.title = { $regex: search, $options: 'i' };

        let result = Jeep.find(query);
        if (sort === 'rating') result = result.sort({ avgRating: -1 });
        else result = result.sort({ createdAt: -1 });

        const jeeps = await result;
        res.json({ success: true, data: jeeps });
    } catch (error) {
        next(error);
    }
};

exports.getJeep = async (req, res, next) => {
    try {
        const jeep = await Jeep.findById(req.params.id);
        if (!jeep) return res.status(404).json({ success: false, message: 'Jeep not found' });
        res.json({ success: true, data: jeep });
    } catch (error) {
        next(error);
    }
};

exports.createJeep = async (req, res, next) => {
    try {

        const images = req.files && req.files['images']
            ? req.files['images'].map(f => f.path)
            : [];


        const driverImage = req.files && req.files['driverImage'] && req.files['driverImage'][0]
            ? req.files['driverImage'][0].path
            : null;

        const driver = {
            name: req.body.driverName,
            phone: req.body.driverPhone,
            image: driverImage
        };

        const jeepData = {
            ...req.body,
            images,
            driver,
            gps: req.body.gps ? JSON.parse(req.body.gps) : undefined
        };

        const jeep = await Jeep.create(jeepData);
        res.status(201).json({ success: true, data: jeep });
    } catch (error) {
        next(error);
    }
};

exports.updateJeep = async (req, res, next) => {
    try {
        let updateData = { ...req.body };
        const existingJeep = await Jeep.findById(req.params.id);
        if (!existingJeep) return res.status(404).json({ success: false, message: 'Jeep not found' });

        if (req.files && req.files['images']) {
            updateData.images = req.files['images'].map(f => f.path);
        }

        const driverImage = req.files && req.files['driverImage'] && req.files['driverImage'][0]
            ? req.files['driverImage'][0].path
            : existingJeep.driver?.image;

        updateData.driver = {
            name: req.body.driverName || existingJeep.driver?.name,
            phone: req.body.driverPhone || existingJeep.driver?.phone,
            image: driverImage
        };

        if (req.body.gps) updateData.gps = JSON.parse(req.body.gps);

        const jeep = await Jeep.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, data: jeep });
    } catch (error) {
        next(error);
    }
};

exports.deleteJeep = async (req, res, next) => {
    try {
        await Jeep.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Jeep deleted' });
    } catch (error) {
        next(error);
    }
};
