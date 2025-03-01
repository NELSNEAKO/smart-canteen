const reservationModel = require("../models/reservationModel");



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
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Get total reservations
        const totalReservations = await reservationModel.countDocuments();

        // Get reservations today
        const reservationsToday = await reservationModel.countDocuments({
            createdAt: { $gte: startOfDay }
        });

        // Get reservations this week
        const reservationsThisWeek = await reservationModel.countDocuments({
            createdAt: { $gte: startOfWeek }
        });

        // Get reservations this month
        const reservationsThisMonth = await reservationModel.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        res.json({
            success: true,
            totalReservations,
            reservationsToday,
            reservationsThisWeek,
            reservationsThisMonth
        });
    } catch (error) {
        console.error("Error fetching reservations count:", error);
        res.status(500).json({ success: false, message: "Error fetching reservation counts" });
    }
};

const getTotalAmounts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalToday = await Payment.sum("amount", {
      where: {
        status: "Completed",
        created_at: { [Op.gte]: today }
      }
    });

    const totalWeekly = await Payment.sum("amount", {
      where: {
        status: "Completed",
        created_at: { [Op.gte]: startOfWeek }
      }
    });

    const totalMonthly = await Payment.sum("amount", {
      where: {
        status: "Completed",
        created_at: { [Op.gte]: startOfMonth }
      }
    });

    return res.json({
      success: true,
      data: {
        daily: totalToday || 0,
        weekly: totalWeekly || 0,
        monthly: totalMonthly || 0
      }
    });
  } catch (error) {
    console.error("Error fetching total amounts:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = {
    getTotalAmounts,
    getTotalReservations,
};
