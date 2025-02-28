const jwt = require('jsonwebtoken');

const authMiddlewarePay = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized Login access.' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: token_decode.id };  // Attach userId properly

        console.log("Decoded Token:", token_decode);
        console.log("User ID extracted:", req.user.userId);

        next();
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(401).json({ success: false, message: 'Unauthorized Login access.' });
    }
};

module.exports = authMiddlewarePay;
