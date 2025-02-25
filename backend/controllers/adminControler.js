const { User } = require('../models/userModel');
const { Reservation } = require('../models/reservationModel');
const { ReservationItem } = require('../models/reservationItemModel');
const { FoodItem } = require('../models/foodModel');
const { Op } = require("sequelize");


const getTopFoodItems = async (req, res) => {
    try {
      const topFoodItems = await ReservationItem.findAll({
        attributes: [
          'item_id',
          [sequelize.fn('COUNT', sequelize.col('item_id')), 'count']
        ],
        include: [
          {
            model: FoodItem,
            as: 'FoodItem', // Ensure alias matches your association
            attributes: ['id', 'name', 'price', 'description'] // Select only necessary fields
          }
        ],
        group: ['item_id', 'FoodItem.id'], // Group by both item_id and FoodItem's id
        order: [[sequelize.literal('count'), 'DESC']],
        limit: 5,
      });
  
      res.json({ success: true, data: topFoodItems });
    } catch (error) {
      console.error("Error fetching top food items:", error);
      res.status(500).json({ success: false, message: "Error fetching top food items" });
    }
  };

  const getTest = async (req, res) => {
    try {
      const now = new Date();
  
      // Daily Orders
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
  
      const dailyOrders = await Reservation.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        },
        attributes: ["id", "createdAt"], // Only return these attributes
        paranoid: false,
        include: [
          { 
            model: User, 
            as: "User", 
            attributes: ["id", "name"], // Return only user ID and name
            paranoid: false 
          },
          { 
            model: ReservationItem, 
            as: "ReservationItems", 
            attributes: ["id", "quantity"], // Return only ID and quantity
            paranoid: false,
            include: [{ 
              model: FoodItem, 
              as: "FoodItem", 
              attributes: ["id", "name", "price"], // Return only food item details
              paranoid: false 
            }]
          }
        ]
      });
  
      // Weekly Orders
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
  
      const weeklyOrders = await Reservation.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek]
          }
        },
        attributes: ["id", "createdAt"],
        paranoid: false,
        include: [
          { 
            model: User, 
            as: "User", 
            attributes: ["id", "name"], 
            paranoid: false 
          },
          { 
            model: ReservationItem, 
            as: "ReservationItems", 
            attributes: ["id", "quantity"], 
            paranoid: false,
            include: [{ 
              model: FoodItem, 
              as: "FoodItem", 
              attributes: ["id", "name", "price"], 
              paranoid: false 
            }]
          }
        ]
      });
  
      // Monthly Orders
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
  
      const monthlyOrders = await Reservation.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        },
        attributes: ["id", "createdAt"],
        paranoid: false,
        include: [
          { 
            model: User, 
            as: "User", 
            attributes: ["id", "name"], 
            paranoid: false 
          },
          { 
            model: ReservationItem, 
            as: "ReservationItems", 
            attributes: ["id", "quantity"], 
            paranoid: false,
            include: [{ 
              model: FoodItem, 
              as: "FoodItem", 
              attributes: ["id", "name", "price"], 
              paranoid: false 
            }]
          }
        ]
      });
  
      // Return the results
      res.json({
        success: true,
        data: {
          daily: dailyOrders,
          weekly: weeklyOrders,
          monthly: monthlyOrders
        }
      });
    } catch (error) {
      console.error("Error fetching total orders:", error);
      res.status(500).json({ success: false, message: "Error fetching total orders", error: error.message });
    }
  };

  const getTotalReservations = async (req, res) => {
    try {
      const now = new Date();
  
      // Daily Orders Count
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
  
      const dailyOrders = await Reservation.count({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        },
        paranoid: false
      });
  
      // Weekly Orders Count
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
  
      const weeklyOrders = await Reservation.count({
        where: {
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek]
          }
        },
        paranoid: false
      });
  
      // Monthly Orders Count
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
  
      const monthlyOrders = await Reservation.count({
        where: {
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        },
        paranoid: false
      });
  
      // Return the total counts
      res.json({
        success: true,
        data: {
          daily: dailyOrders,
          weekly: weeklyOrders,
          monthly: monthlyOrders
        }
      });
    } catch (error) {
      console.error("Error fetching total orders:", error);
      res.status(500).json({ success: false, message: "Error fetching total orders", error: error.message });
    }
  };

module.exports = {
    getTopFoodItems,
    getTotalReservations,
};
