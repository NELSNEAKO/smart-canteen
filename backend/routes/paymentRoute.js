const express = require('express');
const paymentRouter = express.Router();
const { 
    placePayment, 
    verifyReservation, 
    userReservations, 
    listReservations,
    updateStatus,
    vendorListReservation, 
} = require('../controllers/paymentController');
const authMiddlewarePay = require('../middleware/authPay');
const authMiddleware = require('../middleware/auth');



paymentRouter.post('/placePayment',authMiddlewarePay, placePayment);
paymentRouter.post('/verify',verifyReservation);
paymentRouter.post('/user-reservations',authMiddleware, userReservations);
paymentRouter.get('/list', listReservations);
paymentRouter.get('/vendor-list', vendorListReservation);
paymentRouter.post('/status', updateStatus);



module.exports = paymentRouter;