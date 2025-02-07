const express = require('express');
const paymentRouter = express.Router();
const { placePayment } = require('../controllers/paymentController');
const authMiddlewarePay = require('../middleware/authPay');


paymentRouter.post('/placePayment',authMiddlewarePay, placePayment);

module.exports = paymentRouter;