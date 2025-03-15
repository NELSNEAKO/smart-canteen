const express = require('express')
const userAuth = require('../middleware/userAuth');

const {
    studentRegister,
    studentLogin,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
} = require('../controllers/authController');

const authRouter = express.Router();


authRouter.post('/register', studentRegister);

authRouter.post('/login', studentLogin);

authRouter.post('/logout', logout);

authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);

authRouter.post('/verify-account', userAuth, verifyEmail);

authRouter.post('/is-auth', userAuth, isAuthenticated);



module.exports = authRouter;





