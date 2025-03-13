

const express = require('express');
const authMiddleware = require('../middleware/auth');
const authMiddlewarePay = require('../middleware/authPay');
const { placeReservation, 
        verifyReservation, 
        userReservations, 
        fetchAllReservations, 
        updateStatus,
        getLatestReservation 
    } = require('../controllers/reservationController');

const reservationRouter = express.Router();

reservationRouter.post('/place',authMiddlewarePay, placeReservation);
reservationRouter.post('/verify', verifyReservation);
reservationRouter.post('/user-reservations', authMiddleware, userReservations);
reservationRouter.get('/list',fetchAllReservations);
reservationRouter.post('/status',updateStatus);
reservationRouter.get('/latest', authMiddleware, getLatestReservation)


module.exports = reservationRouter;