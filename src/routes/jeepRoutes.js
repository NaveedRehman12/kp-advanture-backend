const express = require('express');
const router = express.Router();
const { getJeeps, getJeep, createJeep, updateJeep, deleteJeep } = require('../controllers/jeepController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');


router.get('/', getJeeps);
router.get('/:id', getJeep);
const uploadFields = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'driverImage', maxCount: 1 }
]);

router.post('/', protect, authorize('SUPER_ADMIN', 'JEEP_MANAGER'), uploadFields, createJeep);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'JEEP_MANAGER'), uploadFields, updateJeep);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'JEEP_MANAGER'), deleteJeep);

module.exports = router;
