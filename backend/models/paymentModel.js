// paymentModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./userModel');

const Payment = sequelize.define('payment', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    reservationItems: {
        type: DataTypes.JSON,
        allowNull: false, // Adjust the schema according to your specific reservation items structure
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
    },
    paymongoPaymentIntentId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    underscored: true, // Uses snake_case column names
});

// Define associations
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { Payment };