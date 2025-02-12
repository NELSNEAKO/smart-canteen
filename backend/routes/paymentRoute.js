const express = require('express');
const paymentRouter = express.Router();
const { placePayment, verifyReservation } = require('../controllers/paymentController');
const authMiddlewarePay = require('../middleware/authPay');


paymentRouter.post('/placePayment',authMiddlewarePay, placePayment);
paymentRouter.post('/verify',verifyReservation);
module.exports = paymentRouter;