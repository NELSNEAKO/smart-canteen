const { sequelize } = require('./userModel'); // Ensure you import the sequelize instance once
const User = require('./userModel').User;
const Reservation = require('./reservationModel').Reservation;
const ReservationItem = require('./reservationItemModel').ReservationItem;
const FoodItem = require('./foodModel').FoodItem;

// Define associations
User.hasMany(Reservation, { as: 'Reservations', foreignKey: 'user_id' });
Reservation.belongsTo(User, { as: 'User', foreignKey: 'user_id' });
Reservation.hasMany(ReservationItem, { as: 'ReservationItems', foreignKey: 'reservation_id' });
ReservationItem.belongsTo(Reservation, { as: 'Reservation', foreignKey: 'reservation_id' });
ReservationItem.belongsTo(FoodItem, { as: 'FoodItem', foreignKey: 'item_id' });
FoodItem.hasMany(ReservationItem, { as: 'ReservationItems', foreignKey: 'item_id' });

// Synchronize all models
sequelize.sync({ alter: true })
  .then(() => console.log('Database synchronized'))
  .catch(error => console.error('Error synchronizing database:', error));

module.exports = {
  User,
  Reservation,
  ReservationItem,
  FoodItem,
  sequelize
};