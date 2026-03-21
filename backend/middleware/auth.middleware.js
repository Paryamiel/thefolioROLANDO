// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Look for 'Authorization: Bearer <token>' in request headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        // Verify token using the secret key in your .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user in the database and attach them to the request object (excluding password)
        req.user = await User.findById(decoded.id).select('-password');
        next(); // Let the request pass to the next function
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };