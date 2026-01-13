const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
    try {

        const notifications = await Notification.find({
            $or: [
                { userId: req.user._id },
                { userId: null }
            ]
        }).sort({ createdAt: -1 }).limit(50);

        res.json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { _id: { $in: req.body.ids }, userId: req.user._id },
            { isRead: true }
        );
        res.json({ success: true, message: 'Notifications marked as read' });
    } catch (error) {
        next(error);
    }
};

exports.createNotification = async (req, res, next) => {
    try {
        const { title, message, userId, type, data } = req.body;
        const notification = await Notification.create({
            title, message, userId, type, data
        });


        if (req.app.get('io')) {
            const io = req.app.get('io');
            if (userId) {
                io.to(userId.toString()).emit('notification', notification);
            } else {
                io.emit('notification', notification);
            }
        }

        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};
