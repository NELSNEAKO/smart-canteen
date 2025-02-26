const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized access. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.body.userId = decoded.id;
        req.body.userType = decoded.userType; // Attach user type (student/vendor)

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized access. Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
