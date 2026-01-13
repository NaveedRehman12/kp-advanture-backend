const express = require('express');
const router = express.Router();
const { createReview, getReviews, getAdminReviews, updateReviewStatus, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', getReviews);
router.post('/', protect, createReview);

router.get('/admin', protect, authorize('SUPER_ADMIN', 'REVIEW_MODERATOR'), getAdminReviews);
router.patch('/admin/:id', protect, authorize('SUPER_ADMIN', 'REVIEW_MODERATOR'), updateReviewStatus);
router.delete('/admin/:id', protect, authorize('SUPER_ADMIN', 'REVIEW_MODERATOR'), deleteReview);

module.exports = router;
