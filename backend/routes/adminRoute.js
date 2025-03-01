const express = require('express')
const {
    getTotalReservations,
    getTotalAmounts
} = require('../controllers/adminControler') //import controller

const db = require('../config/db'); 
const adminRouter = express.Router();

adminRouter.get('/total-reservations', getTotalReservations);

adminRouter.get('/total-amounts', getTotalAmounts);



module.exports = adminRouter;




