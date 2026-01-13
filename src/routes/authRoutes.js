const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, getMe, getUsers, getUserById, deleteUser, updateUserStatus, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/profile', protect, require('../middlewares/uploadMiddleware').upload.single('profileImage'), require('../controllers/authController').updateProfile);

// Admin Routes
router.get('/users', protect, authorize('SUPER_ADMIN'), getUsers);
router.get('/users/:id', protect, authorize('SUPER_ADMIN'), getUserById);
router.delete('/users/:id', protect, authorize('SUPER_ADMIN'), deleteUser);
router.patch('/users/:id/status', protect, authorize('SUPER_ADMIN'), updateUserStatus);

module.exports = router;
