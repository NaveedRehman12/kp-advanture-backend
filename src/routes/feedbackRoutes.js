const express = require('express');
const router = express.Router();
const { createFeedback, getAdminFeedback, updateFeedbackStatus, deleteFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/', protect, createFeedback);

router.get('/admin', protect, authorize('SUPER_ADMIN', 'REVIEW_MODERATOR'), getAdminFeedback);
router.patch('/admin/:id', protect, authorize('SUPER_ADMIN', 'REVIEW_MODERATOR'), updateFeedbackStatus);
router.delete('/admin/:id', protect, authorize('SUPER_ADMIN', 'REVIEW_MODERATOR'), deleteFeedback);

module.exports = router;
