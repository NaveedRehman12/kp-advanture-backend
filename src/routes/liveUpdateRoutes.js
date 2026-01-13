const express = require('express');
const router = express.Router();
const { getLiveUpdates, createLiveUpdate, updateLiveUpdate, deleteLiveUpdate } = require('../controllers/liveUpdateController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', getLiveUpdates);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), createLiveUpdate);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateLiveUpdate);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteLiveUpdate);

module.exports = router;
