// backend/routes/contact.routes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth.middleware');

// ── POST /api/contact ─────────────────────────────────────────
// Public: Submit a new contact form/concern
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const newContact = await Contact.create({ name, email, message });
        res.status(201).json({ message: 'Your message has been sent successfully!', contact: newContact });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── GET /api/contact ──────────────────────────────────────────
// Admin Only: Get all contact submissions
router.get('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        
        // Fetch all messages, newest first
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── DELETE /api/contact/:id ───────────────────────────────────
// Admin Only: Delete a message
router.delete('/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const message = await Contact.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        await message.deleteOne();
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;