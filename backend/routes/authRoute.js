const express = require('express')
const userAuth = require('../middleware/userAuth');

const {
    studentRegister,
    studentLogin,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    studentResetPass,
    sendResetOtp,
    updateStudent,
} = require('../controllers/authController');

const authRouter = express.Router();


authRouter.post('/register', studentRegister);

authRouter.post('/login', studentLogin);

authRouter.post('/logout', logout);

authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);

authRouter.post('/verify-account', userAuth, verifyEmail);

authRouter.post('/is-auth', userAuth, isAuthenticated);

authRouter.post('/send-reset-otp', sendResetOtp);

authRouter.post('/reset-password', studentResetPass);

authRouter.put('/update', userAuth, updateStudent);



module.exports = authRouter;





