const express = require('express');
const paymentRouter = express.Router();
const { placePayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');


paymentRouter.post('/placePayment',authMiddleware, placePayment);

module.exports = paymentRouter;