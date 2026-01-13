const express = require('express');
const router = express.Router();
const { getHotels, getHotel, createHotel, updateHotel, deleteHotel } = require('../controllers/hotelController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.get('/', getHotels);
router.get('/:id', getHotel);

router.post('/', protect, authorize('SUPER_ADMIN', 'HOTEL_MANAGER'), upload.array('images', 5), createHotel);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'HOTEL_MANAGER'), upload.array('images', 5), updateHotel);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'HOTEL_MANAGER'), deleteHotel);

module.exports = router;
