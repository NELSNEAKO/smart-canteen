const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT || 3306,
});

const FoodItem = sequelize.define('food_items', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false // Changed to NOT NULL as per your SQL code
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Not Available' // Added default value
  },
  availability: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Lunch' // Added default value
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true // Changed to allowNull: true as it can be NULL
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false, // Disable Sequelize's automatic timestamps
  tableName: 'food_items' // Ensure Sequelize maps this model to the correct table
});

module.exports = { sequelize, FoodItem };