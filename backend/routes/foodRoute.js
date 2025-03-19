const express = require('express');
const multer = require('multer');
const { addFood, listFood, removeFood, updateStatus, getTopFoodItems, recentFood} = require('../controllers/foodController');

const foodRouter = express.Router();

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Define routes
foodRouter.post('/add', upload.single('image'), addFood);
foodRouter.post('/status', updateStatus);
foodRouter.get('/recent-food', recentFood);

foodRouter.get('/top', getTopFoodItems);
foodRouter.get('/list', listFood);
foodRouter.delete('/remove/:id', removeFood); // Corrected route definition

module.exports = foodRouter;