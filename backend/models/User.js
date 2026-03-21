// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // [cite: 1801]

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // [cite: 1801]
    email: { type: String, required: true, unique: true, lowercase: true }, // [cite: 1801]
    password: { type: String, required: true, minlength: 6 }, // [cite: 1801]
    role: { type: String, enum: ['member', 'admin'], default: 'member' }, // [cite: 1801]
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // [cite: 1801]
    bio: { type: String, default: '' }, // [cite: 1801]
    profilePic: { type: String, default: '' }, // stores filename e.g. 'abc123.jpg' [cite: 1801]
}, { timestamps: true }); // [cite: 1801]

// Pre-save hook to hash the password before saving
// ✅ CORRECTED: Removed 'next' for modern async Mongoose
userSchema.pre('save', async function () {
    // If the password wasn't changed, just return (stop running this function)
    if (!this.isModified('password')) {
        return; 
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if an entered password matches the hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);