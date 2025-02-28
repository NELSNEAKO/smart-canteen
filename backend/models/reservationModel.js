// const { DataTypes } = require('sequelize');
// const { sequelize } = require('./userModel');

// const Reservation = sequelize.define('Reservation', {
//   id: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   user_id: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     allowNull: false,
//     references: {
//       model: 'users',
//       key: 'id'
//     },
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
//   },
//   deleted_at: {
//     type: DataTypes.DATE,
//     allowNull: true // ✅ Soft delete support
//   }
// }, {
//   timestamps: true, // ✅ Auto handle createdAt & updatedAt
//   paranoid: true,  // ✅ Enable soft delete
//   tableName: 'reservations'
// });

// module.exports = { Reservation };
