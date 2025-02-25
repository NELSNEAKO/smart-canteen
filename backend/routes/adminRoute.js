const express = require('express')
const {
    getTopFoodItems,
    getTotalReservations
} = require('../controllers/adminControler') //import controller

const db = require('../config/db'); 
const adminRouter = express.Router();

adminRouter.get('/top-food', getTopFoodItems);

adminRouter.get('/total-reservations', getTotalReservations);



module.exports = adminRouter;




