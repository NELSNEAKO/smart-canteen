const express = require('express');
const { addReservation } = require('../controllers/reservationsController');
const router = express.Router();

// Route to handle adding reservations
router.post('/add-reservation', addReservation);

module.exports = router;
