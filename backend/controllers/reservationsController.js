
const { User } = require('../models/userModel');

// add items to user cart
const addToCart = async (req, res) => {
  try {
    // Find the user by primary key
    let user = await User.findOne({ where: { id: req.body.userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Parse the cart data from the user
    let cartData = user.reservation || {};
    console.log('Current cart data:', cartData);

    // Update the cart data
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    console.log('Updated cart data:', cartData);

    // Update the user's cart data in the database
    await User.update({ reservation: cartData }, { where: { id: req.body.userId } });

    // Fetch the updated user data to verify
    let updatedUser = await User.findOne({ where: { id: req.body.userId } });
    console.log('Updated user data:', updatedUser.reservation);

    res.status(200).json({ success: true, message: 'Item added to cart successfully.' });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ success: false, message: 'An error occurred while processing your request. Please try again.' });
  }
};


// remove items from user cart
const removeFromCart = async (req, res) => {

} 

// fetch user cart data
const getCart = async (req, res) => {

}

module.exports = { addToCart, removeFromCart, getCart };