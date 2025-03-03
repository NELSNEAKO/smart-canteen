const axios = require('axios');
const userModel = require('../models/userModel');
const reservationModel = require('../models/reservationModel');
const foodModel = require('../models/foodModel');

const payMongoKey = process.env.PAYMONGO_SECRET_KEY;
const frontendUrl = process.env.FRONTEND_URL;
// const frontendUrl = 'http://localhost:3000';


const placeReservation = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging: Check incoming data
        console.log("Decoded User from Token:", req.user); // Debugging: Check extracted userId

        // Extract userId from token instead of req.body
        const userId = req.user?.userId;

        if (!userId || !req.body.items || req.body.items.length === 0) {
            return res.status(400).json({ success: false, message: "Missing userId or items" });
        }

        // ✅ Use food name from frontend request
        const formattedItems = req.body.items.map(item => ({
            foodId: item.id,      // Keep foodId
            foodName: item.name,  // Use food name directly from request
            quantity: item.quantity
        }));

        // Create new reservation
        const newReservation = new reservationModel({
            userId,
            items: formattedItems, // ✅ Use formatted items with food names
            amount: req.body.amount,
        });

        await newReservation.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Fetch user details for PayMongo
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // PayMongo Integration
        const line_items = formattedItems.map(item => ({
            currency: 'PHP',
            amount: req.body.items.find(i => i.id === item.foodId).price * 100, // Get price from request
            name: item.foodName, // ✅ Use food name from request
            quantity: item.quantity,
        }));

        const session = await axios.post(
            'https://api.paymongo.com/v1/checkout_sessions',
            {
                data: {
                    attributes: {
                        billing: {
                            name: user.name,    
                            email: user.email
                        },
                        description: 'SmartCanteen Reservation Payment',
                        line_items,
                        payment_method_types: ['gcash', 'card'],
                        send_email_receipt: true,
                        show_description: true,
                        success_url: `${frontendUrl}/verify?success=true&reservationId=${newReservation._id}`,
                        cancel_url: `${frontendUrl}/verify?success=false&reservationId=${newReservation._id}`,
                    }
                }
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(payMongoKey + ':').toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const session_url = session.data?.data?.attributes?.checkout_url;

        res.json({ success: true, session_url });

    } catch (error) {
        console.error("Error creating PayMongo session:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Error creating PayMongo session" });
    }
};



const verifyReservation = async (req, res) => {
    const { success, reservationId } = req.body;
    try {
        if (success === 'true') {
            await reservationModel.findByIdAndUpdate(reservationId, { payment: 'true' });
            res.json({ success: true, message: "Payment successful" });
        } else {
            await reservationModel.findByIdAndDelete(reservationId);
            res.json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        res.json({ success: false, message: " Not Paid" });
    }
}


// user reservations for frontend
const userReservations = async (req, res) => {
    try {
        console.log("Decoded Request Body:", req.body); // Debug request body

        const userId = req.body?.userId; // Extract userId

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const reservations = await reservationModel.find({ userId });

        if (!reservations || reservations.length === 0) {
            return res.status(200).json({ success: true, message: "No reservations found", data: [] });
        }

        console.log("Fetched Reservations:", reservations); // Debug fetched data

        res.status(200).json({ success: true, data: reservations });

    } catch (error) {
        console.error("Error fetching user reservations:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve reservations" });
    }
};




const fetchAllReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.find().populate('userId', 'student_id name email');
        res.json({ success: true, data: reservations });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ success: false, message: "Error fetching reservations" });
    }
};

const updateStatus = async (req, res) => {
    try {
        // Find the reservation record by _id
        const reservation = await reservationModel.findById(req.body.reservationId);

        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation record not found" });
        }

        // Update the status field and save
        reservation.status = req.body.status;
        await reservation.save();

        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};





module.exports = { placeReservation,verifyReservation, userReservations, fetchAllReservations, updateStatus };
