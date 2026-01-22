const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middlewares/authMiddleware');

// Get all bookings (Admin or User's own)
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        // If the user is a regular traveler, only show their own bookings.
        // If they are any kind of admin/manager, show all bookings.
        if (req.user.role === 'USER') {
            query.userId = req.user.id;
        }

        const bookings = await Booking.find(query)
            .populate('entityId') // Populate the Hotel or Jeep details
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create a booking
router.post('/', protect, async (req, res) => {
    try {
        const {
            entityType,
            entityId,
            checkInDate,
            checkOutDate,
            guests,
            pickupDate,
            pickupLocation,
            dropoffLocation,
            passengers,
            customerName,
            customerPhone,
            totalPrice
        } = req.body;

        const booking = await Booking.create({
            userId: req.user.id,
            entityType,
            entityId,
            entityModel: entityType === 'HOTEL' ? 'Hotel' : 'Jeep',
            checkInDate,
            checkOutDate,
            guests,
            pickupDate,
            pickupLocation,
            dropoffLocation,
            passengers,
            customerName,
            customerPhone,
            totalPrice
        });

        res.status(201).json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update booking status
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const isAdmin = req.user.role !== 'USER';

        // Only admin or the owner (cancellation only) can update
        if (!isAdmin && booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Regular users can only cancel their own pending bookings
        if (!isAdmin && status !== 'CANCELLED') {
            return res.status(403).json({ success: false, message: 'Users can only cancel bookings' });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
