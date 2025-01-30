const { User } = require('../models/userModel');
const { Reservation } = require('../models/reservationModel');
const { ReservationItem } = require('../models/reservationItemModel');
const { FoodItem } = require('../models/foodModel');

// Add items to user cart
const addToCart = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    // Validate the input data
    if (!userId || !itemId) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the food item
    const foodItem = await FoodItem.findByPk(itemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Find or create a reservation (cart) for the user
    let reservation = await Reservation.findOne({ where: { user_id: userId } });
    if (!reservation) {
      reservation = await Reservation.create({ user_id: userId });
    }

    // Find or create the reservation item
    let reservationItem = await ReservationItem.findOne({ where: { reservation_id: reservation.id, item_id: itemId } });
    if (reservationItem) {
      // Increment the quantity by 1 if the item already exists in the reservation
      reservationItem.quantity += 1;
      await reservationItem.save();
    } else {
      // Add new item to the reservation with quantity 1
      await ReservationItem.create({ reservation_id: reservation.id, item_id: itemId, quantity: 1 });
    }

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
};


// Remove items from user cart
const removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    // Validate the input data
    if (!userId || !itemId) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Find the user's reservation (cart)
    const reservation = await Reservation.findOne({ where: { user_id: userId } });
    if (!reservation) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the reservation item
    const reservationItem = await ReservationItem.findOne({ where: { reservation_id: reservation.id, item_id: itemId } });
    if (!reservationItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Decrease the quantity by 1
    reservationItem.quantity -= 1;

    // If quantity is zero or less, remove the item from the cart
    if (reservationItem.quantity <= 0) {
      await reservationItem.destroy();
    } else {
      await reservationItem.save();
    }

    res.status(200).json({ message: 'Item quantity decreased successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};

const getCart = async (req, res) => {
  const { userId } = req.body;

  try {
    // Validate the input data
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find the user's reservation (cart) and include only the quantities of the items
    const reservation = await Reservation.findOne({
      where: { user_id: userId },
      include: [{
        model: ReservationItem,
        as: 'ReservationItems',
        attributes: ['item_id', 'quantity'], // Select only item_id and quantity
        include: {
          model: FoodItem,
          as: 'FoodItem',
          attributes: [] // Exclude any attributes from FoodItem
        }
      }]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Extract the quantities from the reservation items
    const quantities = reservation.ReservationItems.map(item => ({
      itemId: item.item_id,
      quantity: item.quantity
    }));

    res.status(200).json(quantities);
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ message: 'Error fetching cart data', error });
  }
}

module.exports = { addToCart, removeFromCart, getCart };