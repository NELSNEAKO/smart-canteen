const { FoodItem } = require('../models/foodModel');
const { ReservationItem } = require('../models/reservationItemModel');
const { sequelize } = require('../models/userModel');
const fs = require('fs');


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

  const food = new FoodItem({
    name,
    price,
    category,
    description,
    status,
    availability,
    image: image_filename,
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
    const foods = await FoodItem.findAll();
    res.json({ success:true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success:false, message: 'An error occurred, please try again' });
  }
}

const removeFood = async (req, res) => {
  const id = req.params.id;

  try {
    const food = await FoodItem.findByPk(id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    // Delete the image file
    if (food.image) {
      fs.unlinkSync(`uploads/${food.image}`);
    }

    await food.destroy();
    res.json({ success: true, message: 'Food removed successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'An error occurred, please try again' });
  }
}

const updateStatus = async (req, res) => {
  try {
    const food = await FoodItem.findByPk(req.body.foodId);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food Item record not found" });
    }
    await food.update({
      status: req.body.status,
      availability: req.body.availability
    });

    res.json({ success: true, message: "Status Updated" });
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
          attributes: ['id', 'name', 'price', 'description'] // Select only necessary fields
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



