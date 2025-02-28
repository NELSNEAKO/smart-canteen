const foodModel = require('../models/foodModel');
const fs = require('fs');
const path = require('path');


// Add food item
const addFood = async (req, res) => {
  const { name, price, category, description, status, availability } = req.body;
  const image_filename = req.file ? req.file.filename : null;

  // Log the req.file object to debug
  console.log('File Upload:', req.file);

  // Validate required fields
  if (!name || !price || !status || !availability) {
    return res.status(400).json({ success: false, message: 'Please provide name, price, status, and availability' });
  }

  const food = new foodModel({
    name,
    price,
    category,
    description,
    status,
    availability,
    image: image_filename
  });

  try {
    await food.save();
    res.status(201).json({ success: true, message: 'Food added successfully' });
  } catch (error) {
    console.error('Database Error:', error.message);
    res.status(500).json({ success: false, message: 'An error occurred, please try again' });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({}); // Use .find() instead of findAll()
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred, please try again' });
  }
};

const removeFood = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the food item by ID
    const food = await foodModel.findById(id);
    // Delete the image file if it exists
    if (food.image) {
      const imagePath = path.join(__dirname, '../uploads', food.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await foodModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Food removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred, please try again' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { foodId, status, availability } = req.body;

    // Find and update the food item
    const food = await foodModel.findByIdAndUpdate(
      foodId,
      { status, availability },
      { new: true } // Returns the updated document
    );

    if (!food) {
      return res.status(404).json({ success: false, message: "Food Item record not found" });
    }

    res.json({ success: true, message: "Status Updated", data: food });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

const getTopFoodItems = async (req, res) => {
  try {
    const topFoodItems = await ReservationItem.findAll({
      attributes: [
        'item_id',
        [sequelize.fn('COUNT', sequelize.col('item_id')), 'count']
      ],
      include: [
        {
          model: FoodItem,
          as: 'FoodItem', // Ensure alias matches your association
          attributes: ['id', 'name', 'price', 'image'] // Select only necessary fields
        }
      ],
      group: ['item_id', 'FoodItem.id'], // Group by both item_id and FoodItem's id
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 5,
    });

    res.json({ success: true, data: topFoodItems });
  } catch (error) {
    console.error("Error fetching top food items:", error);
    res.status(500).json({ success: false, message: "Error fetching top food items" });
  }
};


 
module.exports = {
  addFood,
  listFood,
  removeFood,
  updateStatus,
  getTopFoodItems,
};



