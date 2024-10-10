const express = require('express');
const { 
    addReservation, 
    getReservations,
    updateReservation,
    deleteReservation,
} = require('../controllers/reservationsController');

const router = express.Router();

// Route to handle adding reservations
router.post('/add-reservation', addReservation);

// Route to handle get reservations
router.get('/get-Reservation', getReservations);
    
// Route to update an existing status by ID
router.put('/update-Reservation/:id', updateReservation);

// Route to delete an existing reservation
router.delete('/delete-Reservation/:reservationId', deleteReservation);

module.exports = router;
