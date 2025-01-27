const express = require('express');
const { 
    addToCart,
    removeFromCart,
    getCart,
} = require('../controllers/reservationsController');

const reservationRouter = express.Router();

reservationRouter.post('/add', addToCart);
reservationRouter.post('/remove', removeFromCart);
reservationRouter.post('/get', getCart);

module.exports = router;
