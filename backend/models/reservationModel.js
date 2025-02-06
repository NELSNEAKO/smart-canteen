const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./userModel');

// Define the Reservation model
const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users', // References the `users` table
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false, // Disable automatic `createdAt` and `updatedAt` fields
  tableName: 'reservations' // Ensure the table name matches the database table
});

module.exports = { Reservation };