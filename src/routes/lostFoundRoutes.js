const express = require('express');
const router = express.Router();
const { createLostFound, getLostFounds, getAdminLostFounds, updateLostFoundStatus, getLostFoundById } = require('../controllers/lostFoundController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.post('/', protect, upload.array('images', 3), createLostFound);
router.get('/', protect, getLostFounds);

router.get('/admin', protect, authorize('SUPER_ADMIN', 'REVIEW_MODERATOR'), getAdminLostFounds);
router.get('/admin/:id', protect, authorize('SUPER_ADMIN', 'REVIEW_MODERATOR'), getLostFoundById);
router.patch('/admin/:id', protect, authorize('SUPER_ADMIN', 'REVIEW_MODERATOR'), updateLostFoundStatus);

module.exports = router;
