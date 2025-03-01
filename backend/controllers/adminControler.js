const reservationModel = require("../models/reservationModel");
const moment = require('moment-timezone'); // Import moment-timezone


const getTotalReservations = async (req, res) => {
    try {
        const now = new Date(); // Current time

        // Get the start of today (midnight)
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // End of today

        // Get the start of this week (Sunday, midnight)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Move to Sunday
        startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Saturday, midnight)
        endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the week

        // Get the start of this month (1st day of the month)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the month

        console.log("Start of Day:", startOfDay);
        console.log("End of Day:", endOfDay);
        console.log("Start of Week:", startOfWeek);
        console.log("End of Week:", endOfWeek);
        console.log("Start of Month:", startOfMonth);
        console.log("End of Month:", endOfMonth);

        // Get total reservations
        const totalReservations = await reservationModel.countDocuments();

        // Get reservations for today
        const reservationsToday = await reservationModel.countDocuments({
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        });

        // Get reservations for this week
        const reservationsThisWeek = await reservationModel.countDocuments({
            createdAt: { $gte: startOfWeek, $lt: endOfWeek }
        });

        // Get reservations for this month
        const reservationsThisMonth = await reservationModel.countDocuments({
            createdAt: { $gte: startOfMonth, $lt: endOfMonth }
        });

        // Return the results
        res.json({
            success: true,
            data: {
                total: totalReservations,
                today: reservationsToday,
                weekly: reservationsThisWeek,
                monthly: reservationsThisMonth
            }
        });

    } catch (error) {
        console.error("Error fetching reservations count:", error);
        res.status(500).json({ success: false, message: "Error fetching reservation counts" });
    }
};

  

const getTotalAmounts = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday start
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Query revenue amounts
        const dailyAmount = await reservationModel.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const weeklyAmount = await reservationModel.aggregate([
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const monthlyAmount = await reservationModel.aggregate([
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            success: true,
            data: {
                daily: dailyAmount.length > 0 ? dailyAmount[0].total : 0,
                weekly: weeklyAmount.length > 0 ? weeklyAmount[0].total : 0,
                monthly: monthlyAmount.length > 0 ? monthlyAmount[0].total : 0
            }
        });
    } catch (error) {
        console.error("Error fetching total amounts:", error);
        res.status(500).json({ success: false, message: "Error fetching total amounts" });
    }
};


module.exports = {
    getTotalAmounts,
    getTotalReservations,
};
