const express = require('express');
const { 
    addReservation, 
    getReservations,
    updateReservation,
} = require('../controllers/reservationsController');

const router = express.Router();

// Route to handle adding reservations
router.post('/add-reservation', addReservation);

// Route to handle get reservations
router.get('/get-Reservation', getReservations);

// Route to handle get reservationStatus

// Route to update an existing status by ID
router.put('/update-Reservation/:id', updateReservation);


module.exports = router;
