// backend/seeder.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        
        // Check if our admin already exists so we don't make duplicates
        const adminExists = await User.findOne({ email: 'admin@thefolio.com' });
        
        if (adminExists) {
            console.log('Admin user already exists!');
            process.exit();
        }

        // Create the admin user
        await User.create({
            name: 'Super Admin',
            email: 'admin@thefolio.com',
            password: 'password123', // Your User model will automatically hash this!
            role: 'admin'
        });

        console.log('Admin user seeded successfully! 🚀');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();