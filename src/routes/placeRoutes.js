const express = require('express');
const router = express.Router();
const { getPlaces, getPlace, createPlace, updatePlace, deletePlace } = require('../controllers/placeController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', getPlaces);
router.get('/:id', getPlace);

router.post('/', protect, authorize('SUPER_ADMIN', 'LOCATION_MANAGER'), upload.array('images', 5), createPlace);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'LOCATION_MANAGER'), upload.array('images', 5), updatePlace);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'LOCATION_MANAGER'), deletePlace);

module.exports = router;
