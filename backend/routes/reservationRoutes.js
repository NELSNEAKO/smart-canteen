const express = require('express');
const { 
    addReservation, 
    getReservations,
    getReservationStatus, 
} = require('../controllers/reservationsController');

const router = express.Router();

// Route to handle adding reservations
router.post('/add-reservation', addReservation);

// Route to handle get reservations
router.get('/get-Reservation', getReservations);

// Route to handle get reservationStatus
router.get('/get-ReservationStatus', getReservationStatus);

module.exports = router;
