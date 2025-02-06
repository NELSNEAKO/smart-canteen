const express = require('express');
const paymentRouter = express.Router();
const { placePayment } = require('../controllers/paymentController');

paymentRouter.post('/placePayment', placePayment);

module.exports = paymentRouter;