const express = require('express');
const router = express.Router();
const { createAdminUser, getUsers, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.post('/users', createAdminUser);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
