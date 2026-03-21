// backend/models/Post.js
const mongoose = require('mongoose');

// 1. 💬 Create a mini-schema specifically for comments
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }); // This automatically adds createdAt for each comment!

// 2. 📝 Your existing Post schema, but now with a comments array
const postSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true }, 
    body: { type: String, required: true }, 
    image: { type: String, default: '' }, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    status: { type: String, enum: ['published', 'removed'], default: 'published' }, 
    comments: [commentSchema] // 👈 NEW: Every post now holds its own list of comments
}, { timestamps: true }); 

module.exports = mongoose.model('Post', postSchema);