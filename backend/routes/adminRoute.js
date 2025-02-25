const express = require('express')
const {
    getTopFoodItems,
    getTotalReservations,
    getTotalAmounts
} = require('../controllers/adminControler') //import controller

const db = require('../config/db'); 
const adminRouter = express.Router();

adminRouter.get('/top-food', getTopFoodItems);

adminRouter.get('/total-reservations', getTotalReservations);

adminRouter.get('/total-amounts', getTotalAmounts);



module.exports = adminRouter;




