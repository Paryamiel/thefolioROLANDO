// backend/routes/post.routes.js
const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');

const router = express.Router();

// ── GET /api/posts ────────────────────────────────────────────
// Public: Get all published posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET /api/posts/:id ────────────────────────────────────────
// Public: Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name profilePic')
            // 👈 NEW: We also need to populate the names/pics of the people who commented!
            .populate('comments.author', 'name profilePic'); 
            
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── POST /api/posts ───────────────────────────────────────────
// Member or Admin: create new post
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, body } = req.body;
        const image = req.file ? req.file.filename : '';
        const post = await Post.create({ title, body, image, author: req.user._id });
        await post.populate('author', 'name profilePic');
        res.status(201).json(post);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── PUT /api/posts/:id ────────────────────────────────────────
// Edit: only post owner OR admin
router.put('/:id', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        // Check permissions
        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Unauthorized to edit this post' });

        if (req.body.title) post.title = req.body.title;
        if (req.body.body) post.body = req.body.body;
        if (req.file) post.image = req.file.filename;

        await post.save();
        res.json(post);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── DELETE /api/posts/:id ─────────────────────────────────────
// Delete: only post owner OR admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Unauthorized to delete this post' });

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── POST /api/posts/:id/comments ──────────────────────────────
// Protected: Any logged-in user can add a comment
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // 1. Create the new comment object
        const newComment = {
            text,
            author: req.user._id
        };

        // 2. Push it into the post's comments array
        post.comments.push(newComment);
        await post.save();

        // 3. Populate the author info so the frontend can display it immediately
        await post.populate('comments.author', 'name profilePic');

        // 4. Send back the updated post
        res.status(201).json(post);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// ── DELETE /api/posts/:postId/comments/:commentId ─────────────
// Admin or Comment Owner: Delete a specific comment
router.delete('/:postId/comments/:commentId', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Find the specific comment
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Check permissions: Is it the person who wrote the comment, OR an Admin?
        const isOwner = comment.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        // Remove the comment and save the post
        comment.deleteOne(); 
        await post.save();

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

module.exports = router;