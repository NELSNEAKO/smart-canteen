const db = require('../config/db');

// Add new reservation
const addReservation = (req, res) => {
  const { studentId, foodItems } = req.body;  // studentId should be a string
  if (!studentId || !foodItems || !foodItems.length) {
      return res.status(400).json({ message: 'Invalid reservation data. Please provide a student ID and food items.' });
  }

  // Using a transaction to ensure all items are inserted or nothing happens in case of an error
  db.beginTransaction((err) => {
      if (err) {
          return res.status(500).json({ message: 'Database transaction error', error: err });
      }

      // Prepare to insert each food item in the reservation
      const insertPromises = foodItems.map((item) => {
          return new Promise((resolve, reject) => {
              const query = 'INSERT INTO reservations (student_id, food_id, quantity, status) VALUES (?, ?, ?, ?)';
              db.query(query, [studentId, item.foodId, item.quantity, 'Pending'], (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
              });
          });
      });

      // Execute all insert queries and commit the transaction if successful
      Promise.all(insertPromises)
          .then(() => {
              db.commit((err) => {
                  if (err) {
                      return db.rollback(() => {
                          res.status(500).json({ message: 'Error committing transaction', error: err });
                      });
                  }
                  res.status(201).json({ message: 'Reservation successful!' });
              });
          })
          .catch((error) => {
              db.rollback(() => {
                  res.status(500).json({ message: 'Error processing reservation', error });
              });
          });
  });
};

const getReservations = (req, res) => {
  const query = `
    SELECT 
      r.id,
      r.quantity, 
      r.status, 
      fi.name AS foodName,
      fi.price, 
      u.student_id AS studentId
    FROM 
      reservations r
    JOIN 
      food_items fi ON r.food_id = fi.id
    JOIN 
      users u ON r.student_id = u.student_id  -- Ensure that this references the correct column in your users table
  `;

  // Query the database
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err); // Logs the error for debugging
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(200).json(results); // Sends a 200 status with the query results
  });
};

// Update Reservation Status
const updateReservation = (req, res) => {
  const reservationId = req.params.id;
  const { status } = req.body;

  const query = `
    UPDATE reservations 
    SET status = ? 
    WHERE id = ?
  `;

  db.query(query, [status, reservationId], (err, result) => {
    if (err) {
      console.error('Error updating reservation status:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation status updated successfully' });
  });
}


const deleteReservation = (req, res) => {
  const { reservationId } = req.params; // Extract reservationId from URL

  const deleteQuery = 'DELETE FROM reservations WHERE id = ?';
  db.query(deleteQuery, [reservationId], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Database error while deleting' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Reservation not found' });
      }

      res.status(200).json({ message: 'Reservation deleted successfully' });
  });
};

const getOrderList = (req, res) => {
  const { studentId } = req.query; // Get the studentId from the query parameters

  // Validate studentId
  if (!studentId) {
    return res.status(400).json({ message: 'Student ID is required' });
  }

  const query = `
    SELECT 
      r.id AS reservationId, 
      r.quantity, 
      r.status, 
      fi.name AS foodName, 
      fi.price AS price 
    FROM 
      reservations r
    JOIN 
      food_items fi ON r.food_id = fi.id
    JOIN 
      users u ON r.student_id = u.student_id
    WHERE 
      u.student_id = ?; 
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred while fetching the orders.', error: err });
    }

    // Wrap results in an object
    res.status(200).json({ orders: results }); // Sends the reservation data back to the client
  });
};






module.exports = { 
  addReservation,
  getReservations,
  getOrderList,
  updateReservation,
  deleteReservation
};
