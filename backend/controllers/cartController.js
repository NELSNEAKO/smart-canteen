const userModel = require('../models/userModel');


const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    // Find the user
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure cartData is an object, not an array or Map
    let cartData = userData.cartData || {}; 

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(
      userId, 
      { $set: { cartData } },  
      { new: true }
    );

    res.json({ success: true, message: "Item added to cart successfully", cartData: cartData });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Error adding item to cart", error: error.message });
  }
};





/// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData || {};
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: cartData });
    res.json({ success: true, message: "Item removed from cart successfully" });
  } catch (error) {
    console.log("Error in removeFromCart:", error);
    res.status(500).json({ success: false, message: "Error removing item from cart" });
  }
};

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log("Error in getCart:", error);
    res.status(500).json({ success: false, message: "Error fetching cart data" });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate({
        path: 'user',
        select: 'id name email' // Include relevant user details
      })
      .populate({
        path: 'items.item',
        select: 'name price' // Include relevant food item details
      });

    res.status(200).json({ success: true, reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations', error });
  }
};


module.exports = { addToCart, removeFromCart, getCart, getAllReservations };
