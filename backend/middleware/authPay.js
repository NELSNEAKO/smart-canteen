const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded.user; // Add the user info to req.user
        next();
    });
};

module.exports = authenticate;
