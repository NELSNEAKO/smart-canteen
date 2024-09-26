const db = require('../config/db');

// Add new reservation
const addReservation = (req, res) => {
  const { studentId, foodItems } = req.body;  // Expect foodItems to be an array of {foodId, quantity}
  
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

module.exports = { addReservation };
