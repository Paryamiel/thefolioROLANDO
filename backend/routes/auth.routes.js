// backend/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

const router = express.Router();

// Helper function — generates a JWT token that expires in 7 days
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email is already registered' });
        
        const user = await User.create({ name, email, password });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });
        
        // Block inactive users from logging in
        if (user.status === 'inactive') return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            token: generateToken(user._id)
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
    // req.user is supplied by the 'protect' middleware!
    res.json(req.user);
});

// ── PUT /api/auth/profile ─────────────────────────────────────
// Update name, email, bio, or upload a new profile picture
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 🛡️ NEW: Check if they are updating their email, and if it's already taken!
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ message: 'That email is already in use.' });
            }
            user.email = req.body.email;
        }

        // Keep your existing name/bio/pic logic
        if (req.body.name) user.name = req.body.name;
        if (req.body.bio) user.bio = req.body.bio;
        if (req.file) user.profilePic = req.file.filename;
        
        await user.save();
        
        const updated = await User.findById(user._id).select('-password');
        res.json(updated);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// ── PUT /api/auth/change-password ────────────────────────────
router.put('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        
        const match = await user.matchPassword(currentPassword);
        if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
        
        user.password = newPassword;
        await user.save();
        
        res.json({ message: 'Password updated successfully' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET /api/auth/users ───────────────────────────────────────
// Admin Only: Get all registered accounts
router.get('/users', protect, async (req, res) => {
    try {
        // 🛡️ Extra security: Make sure only admins can fetch this list
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        
        // Fetch all users, but don't send their passwords!
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

module.exports = router;