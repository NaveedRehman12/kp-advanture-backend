const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, createNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/read', protect, markAsRead);
router.post('/admin', protect, authorize('SUPER_ADMIN'), createNotification);

module.exports = router;
