const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    
    console.log('Received Token:', token); // Debugging: Log the token
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized Login access.' });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id; // Attach userId to request body
        next();
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(401).json({ success: false, message: 'Unauthorized Login access.' });
    }
}

module.exports = authMiddleware;

