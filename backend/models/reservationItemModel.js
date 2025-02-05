const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./userModel');
const { FoodItem } = require('./foodModel');

// Define the ReservationItem model
const ReservationItem = sequelize.define('ReservationItem', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  reservation_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'reservations', // References the `reservations` table
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  item_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'food_items', // References the `food_items` table
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false, // Disable automatic `createdAt` and `updatedAt` fields
  tableName: 'reservation_items' // Ensure the table name matches the database table
});

// Define associations
// ReservationItem.belongsTo(FoodItem, { foreignKey: 'item_id', as: 'FoodItem' });

module.exports = { ReservationItem };