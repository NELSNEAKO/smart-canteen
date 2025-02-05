const express = require('express');
const { 
    addToCart,
    removeFromCart,
    getCart,
    getAllReservations,
} = require('../controllers/reservationsController');
const authMiddleware = require('../middleware/auth');

const reservationRouter = express.Router();

reservationRouter.post('/add', authMiddleware, addToCart);
reservationRouter.post('/remove', authMiddleware, removeFromCart);
reservationRouter.get('/get', authMiddleware, getCart);
reservationRouter.get('/getAll', getAllReservations);

module.exports = reservationRouter;

