const express = require('express')
const vendorAuth = require('../middleware/vendorAuth');

const {
    vendorRegister,
    vendorLogin,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    vendorResetPass,
    sendResetOtp
} = require('../controllers/vendorAuthController');

const vendorRoute = express.Router();


vendorRoute.post('/register', vendorRegister);

vendorRoute.post('/login', vendorLogin);

vendorRoute.post('/logout', logout);

vendorRoute.post('/send-verify-otp', vendorAuth, sendVerifyOtp);

vendorRoute.post('/verify-account', vendorAuth, verifyEmail);

vendorRoute.post('/is-auth', vendorAuth, isAuthenticated);

vendorRoute.post('/send-reset-otp', sendResetOtp);

vendorRoute.post('/reset-password', vendorResetPass);





module.exports = vendorRoute;





