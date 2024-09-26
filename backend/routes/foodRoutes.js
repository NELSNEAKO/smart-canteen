const express = require('express');
const {
  addFoodItem,
  updateFoodItem,
  getFoodItems,
  getFoodUpdates,
  deleteFoodItem,
  upload
} = require('../controllers/foodController');

const {
  registerUser,
  loginUser
} = require('../controllers/userController');

const db = require('../config/db');
const router = express.Router();

// Route to add a new food item with an image
router.post('/food-items', upload.single('image'), addFoodItem);

// Route to update an existing food item by ID, including updating its image
router.put('/food-items/:id', upload.single('image'), updateFoodItem);

// Route to retrieve all food items
router.get('/food-items', getFoodItems);

// Route to get real-time food updates
router.get('/food-updates', getFoodUpdates);

// Route to delete an existing food item by ID
router.delete('/food-items/:id', deleteFoodItem);

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// API to get reservations for the vendor's food items
router.get('/reservations', (req, res) => {
  const query = `
    SELECT r.quantity, r.status, fi.name AS foodName, u.student_id AS studentId
    FROM reservations r
    JOIN food_items fi ON r.food_id = fi.id
    JOIN users u ON r.student_id = u.id`;  // Join the users table to get student_id

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});

// Handle adding a reservation (for students)
router.post('/add-reservation', (req, res) => {
  const { studentId, foodItems } = req.body;

  if (!studentId || !foodItems || !foodItems.length) {
    return res.status(400).json({ message: 'Invalid reservation data' });
  }

  // First, fetch the user's actual ID using the student_id
  const getUserQuery = 'SELECT id FROM users WHERE student_id = ?';
  
  db.query(getUserQuery, [studentId], (err, userResults) => {
    if (err || userResults.length === 0) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    const userId = userResults[0].id;

    // Now, insert each food item with the user's actual ID into the reservations table
    const reservationQuery = 'INSERT INTO reservations (student_id, food_id, quantity) VALUES (?, ?, ?)';

    // Use a loop to insert each food item in the cart as a separate row in the database
    foodItems.forEach((item) => {
      const { foodId, quantity } = item;

      db.query(reservationQuery, [userId, foodId, quantity], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
        }
      });
    });

    // Send a success response after inserting all items
    res.status(201).json({ message: 'Reservation added successfully' });
  });
});

module.exports = router;
