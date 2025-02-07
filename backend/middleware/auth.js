const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized access. No token provided.' });
    }
    // console.log('🔹 Received Token:', token); // Log token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.body.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized access. Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
