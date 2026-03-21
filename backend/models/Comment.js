// backend/models/Comment.js
const mongoose = require('mongoose'); // [cite: 1806]

const commentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // [cite: 1806]
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // [cite: 1806]
    body: { type: String, required: true, trim: true }, // [cite: 1806]
}, { timestamps: true }); // [cite: 1806]

module.exports = mongoose.model('Comment', commentSchema); // [cite: 1807]