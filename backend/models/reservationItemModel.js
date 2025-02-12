const { DataTypes } = require('sequelize');
const { sequelize } = require('./userModel');

const ReservationItem = sequelize.define('ReservationItem', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  reservation_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'reservations',
      key: 'id'
    },
    onDelete: 'SET NULL', // ✅ Prevent orphaned items when reservations are deleted
    onUpdate: 'CASCADE'
  },
  item_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'food_items',
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
  timestamps: true,
  paranoid: true, // ✅ Enable soft delete
  tableName: 'reservation_items'
});

module.exports = { ReservationItem };
