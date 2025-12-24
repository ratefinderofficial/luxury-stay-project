const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20, // Limit badha di hai testing ke liye
    message: { message: 'Too many login attempts, please try again after 10 minutes.' }
});

// Ensure karein ki ye dono export ho rahe hain
module.exports = { apiLimiter, authLimiter };