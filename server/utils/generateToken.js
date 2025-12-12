const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // JWT Secret .env se lega
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// --- YE LINE SABSE ZAROORI HAI ---
module.exports = generateToken;