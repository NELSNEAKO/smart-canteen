const express = require('express');
const { 
    addToCart,
    removeFromCart,
    getCart,
} = require('../controllers/reservationsController');
const authMiddleware = require('../middleware/auth');

const reservationRouter = express.Router();

reservationRouter.post('/add', authMiddleware, addToCart);
reservationRouter.post('/remove', authMiddleware, removeFromCart);
reservationRouter.get('/get', authMiddleware, getCart);

module.exports = reservationRouter;