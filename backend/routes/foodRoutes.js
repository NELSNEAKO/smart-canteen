const express = require('express');
const {
  addFoodItem,
  updateFoodItem,
  getFoodItems,
  getFoodUpdates,
  deleteFoodItem,
  getTopSales,
  upload,
} = require('../controllers/foodController');


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

// Route to retrieve all top Sales
router.get('/get-top-sales', getTopSales);

// Route to delete an existing food item by ID
router.delete('/food-items/:id', deleteFoodItem);

module.exports = router;
