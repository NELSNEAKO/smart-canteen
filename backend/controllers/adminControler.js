const reservationModel = require("../models/reservationModel");
const moment = require('moment-timezone'); // Import moment-timezone


const getTotalReservations = async (req, res) => {
    try {
        // Get the current date from the latest reservation
        const latestReservation = await reservationModel.findOne().sort({ date: -1 });
        if (!latestReservation) {
            return res.json({ totalReservations: 0, dailyReservations: 0, weeklyReservations: 0, monthlyReservations: 0 });
        }

        const currentDate = latestReservation.date;
        const startOfDay = new Date(currentDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setUTCHours(23, 59, 59, 999));
        const startOfWeek = new Date(currentDate);
        startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
        startOfWeek.setUTCHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);
        const startOfMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1);
        const endOfMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0);
        endOfMonth.setUTCHours(23, 59, 59, 999);

        const getReservationCount = async (start, end) => {
            return await reservationModel.countDocuments({ date: { $gte: start, $lte: end } });
        };

        const totalReservations = await reservationModel.countDocuments();
        const dailyReservations = await getReservationCount(startOfDay, endOfDay);
        const weeklyReservations = await getReservationCount(startOfWeek, endOfWeek);
        const monthlyReservations = await getReservationCount(startOfMonth, endOfMonth);

        res.json({
            success: true, data: {
            totalReservations,
            dailyReservations,
            weeklyReservations,
            monthlyReservations,
        }});
    } catch (error) {
        console.error("Error fetching reservation counts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

  

const getTotalAmounts = async (req, res) => {
    try {
        // Get the current date from the database
        const latestReservation = await reservationModel.findOne().sort({ date: -1 });
        if (!latestReservation) {
            return res.json({ dailyRevenue: 0, weeklyRevenue: 0, monthlyRevenue: 0 });
        }

        const currentDate = latestReservation.date;
        const startOfDay = new Date(currentDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setUTCHours(23, 59, 59, 999));
        const startOfWeek = new Date(currentDate);
        startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
        startOfWeek.setUTCHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);
        const startOfMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1);
        const endOfMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0);
        endOfMonth.setUTCHours(23, 59, 59, 999);

        const getRevenue = async (start, end) => {
            const result = await reservationModel.aggregate([
                { $match: { date: { $gte: start, $lte: end } } },
                { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
            ]);
            return result.length > 0 ? result[0].totalRevenue : 0;
        };

        const dailyRevenue = await getRevenue(startOfDay, endOfDay);
        const weeklyRevenue = await getRevenue(startOfWeek, endOfWeek);
        const monthlyRevenue = await getRevenue(startOfMonth, endOfMonth);

        res.json({success: true, data: {
            dailyRevenue,
            weeklyRevenue,
            monthlyRevenue,
        }});
    } catch (error) {
        console.error("Error fetching revenue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    getTotalAmounts,
    getTotalReservations,
};
