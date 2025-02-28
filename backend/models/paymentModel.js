// const { DataTypes } = require('sequelize');
// const { sequelize } = require('./userModel');

// const Payment = sequelize.define('Payment', {
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
//   reservation_item_id: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     allowNull: true,
//     references: {
//       model: 'reservation_items',
//       key: 'id'
//     },
//     onDelete: 'SET NULL',
//     onUpdate: 'CASCADE'
//   },
//   amount: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false
//   },
//   status: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: 'Pending'
//   },
//   paymongo_checkout_session_id: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   payment_status: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
//   },
//   created_at: {  // ✅ Explicitly define created_at
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   },
//   updated_at: {  // ✅ Explicitly define updated_at
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   }
// }, {
//   timestamps: false,  // ✅ Disable Sequelize auto `createdAt` and `updatedAt`
//   tableName: 'payment'
// });

// module.exports = { Payment };
