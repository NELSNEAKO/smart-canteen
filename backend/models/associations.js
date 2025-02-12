const { sequelize } = require('./userModel');
const { User } = require('./userModel');
const { Reservation } = require('./reservationModel');
const { ReservationItem } = require('./reservationItemModel');
const { FoodItem } = require('./foodModel');
const { Payment } = require('./paymentModel');

// Define associations
User.hasMany(Reservation, { as: 'Reservations', foreignKey: 'user_id', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

Reservation.hasMany(ReservationItem, { as: 'ReservationItems', foreignKey: 'reservation_id', onDelete: 'SET NULL' });
ReservationItem.belongsTo(Reservation, { as: 'Reservation', foreignKey: 'reservation_id' });

ReservationItem.belongsTo(FoodItem, { as: 'FoodItem', foreignKey: 'item_id' });
FoodItem.hasMany(ReservationItem, { as: 'ReservationItems', foreignKey: 'item_id', onDelete: 'CASCADE' });

// ✅ Define Payment Associations
User.hasMany(Payment, { as: 'Payments', foreignKey: 'user_id', onDelete: 'CASCADE' });
Payment.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

ReservationItem.hasOne(Payment, { as: 'Payment', foreignKey: 'reservation_item_id', onDelete: 'SET NULL' });
Payment.belongsTo(ReservationItem, { as: 'ReservationItem', foreignKey: 'reservation_item_id' });

// Synchronize all models
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database synchronized'))
  .catch(error => console.error('❌ Error synchronizing database:', error));

module.exports = {
  User,
  Reservation,
  ReservationItem,
  FoodItem,
  Payment,
  sequelize
};
