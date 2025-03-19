const express = require('express')
const {
    getTotalReservations,
    getTotalAmounts,
    logout,
    adminLogin,
    verifyEmail,
    adminRegister,
    sendResetOtp,
    sendVerifyOtp,
    adminResetPass,
    isAuthenticated,
    getAdminData,
} = require('../controllers/adminControler') //import controller

const adminAuth = require("../middleware/adminAuth");

const db = require('../config/db'); 
const adminRouter = express.Router();

adminRouter.get('/total-reservations', getTotalReservations);

adminRouter.get('/data', adminAuth, getAdminData);


adminRouter.get('/total-amounts', getTotalAmounts);

adminRouter.post('/register', adminRegister);

adminRouter.post('/login', adminLogin);

adminRouter.post('/logout', logout);

adminRouter.post('/send-verify-otp', adminAuth, sendVerifyOtp);

adminRouter.post('/verify-account', adminAuth, verifyEmail);

adminRouter.post('/is-auth', adminAuth, isAuthenticated);

adminRouter.post('/send-reset-otp', sendResetOtp);

adminRouter.post('/reset-password', adminResetPass);



module.exports = adminRouter;




