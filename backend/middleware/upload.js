// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads/ folder if it does not exist yet
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Where and how to save the files
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        // Create a unique filename: fieldname-timestamp.extension (e.g., image-163456789.jpg)
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Initialize multer with the storage config
const upload = multer({ storage });

module.exports = upload;