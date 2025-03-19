const foodModel = require('../models/foodModel');
const reservationModel = require('../models/reservationModel');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { log } = require('console');


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
    // Step 1: Aggregate to find top food item IDs
    const topItems = await reservationModel.aggregate([
      { $unwind: "$items" },
      { 
        $group: {
          _id: "$items.foodId",  // Make sure this matches the field in your schema
          totalQuantity: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    console.log("Top Items from Aggregation:", topItems);

    if (topItems.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Step 2: Convert _id to ObjectId if necessary
    const topFoodIds = topItems
      .filter(item => item._id) // Avoid null values
      .map(item => new mongoose.Types.ObjectId(item._id)); // Convert explicitly

    console.log("Fetching food details for IDs:", topFoodIds);

    // Step 3: Debugging food collection
    const allFoods = await foodModel.find();
    // console.log("All Food Items in DB:", allFoods);

    // Step 4: Query for food items matching top IDs
    const foods = await foodModel.find({ _id: { $in: topFoodIds } });

    // console.log("Top Food Items:", foods);
 
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching top items:", error);
    res.status(500).json({ success: false, message: "Error fetching top items" });
  }
};

const recentFood = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today in local time
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today in local time

    const foods = await foodModel.find({
      created_at: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() }
    });

    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching today's food:", error);
    res.status(500).json({ success: false, message: "Error fetching today's food" });
  }
};



 
module.exports = {
  addFood,
  listFood,
  removeFood,
  updateStatus,
  getTopFoodItems,
  recentFood,
};



