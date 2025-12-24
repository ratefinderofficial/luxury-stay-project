const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Ensure this config file exists and exports configured cloudinary v2

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'luxury_stay_uploads', // Folder name in Cloudinary Dashboard
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Resize huge images
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit: 5MB
});

module.exports = upload;