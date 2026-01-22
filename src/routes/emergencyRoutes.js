const express = require('express');
const router = express.Router();
const EmergencyPost = require('../models/EmergencyPost');

// Get all
router.get('/', async (req, res) => {
    try {
        const posts = await EmergencyPost.find();
        res.json({ success: true, data: posts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create
router.post('/', async (req, res) => {
    try {
        const post = new EmergencyPost(req.body);
        await post.save();
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await EmergencyPost.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
