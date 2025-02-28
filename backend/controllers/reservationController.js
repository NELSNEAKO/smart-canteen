const axios = require('axios');
const userModel = require('../models/userModel');
const reservationModel = require('../models/reservationModel');

const payMongoKey = process.env.PAYMONGO_SECRET_KEY;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';


const placeReservation = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging: Check incoming data
        console.log("Decoded User from Token:", req.user); // Debugging: Check extracted userId

        // Extract userId from token instead of req.body
        const userId = req.user?.userId; 

        if (!userId || !req.body.items || req.body.items.length === 0) {
            return res.status(400).json({ success: false, message: "Missing userId or items" });
        }

        // Create new reservation
        const newReservation = new reservationModel({
            userId: userId, // Extracted from token
            items: req.body.items,
            amount: req.body.amount,
        });

        await newReservation.save();
        await userModel.findByIdAndUpdate(userId, { cartData: [] });

        // Fetch user details for PayMongo
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // PayMongo Integration
        const line_items = req.body.items.map((item) => ({
            currency: 'PHP',
            amount: item.price * 100,
            name: item.name, // Changed from item.name to item.description
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
        console.log("Decoded User:", req.body); // Debugging: Check extracted user

        const reservations = await reservationModel.find({ userId: req.body.userId }); // Corrected access

        res.json({ success: true, data: reservations });
    } catch (error) {
        console.log("Error fetching user reservations:", error);
        res.status(500).json({ success: false, message: "Error fetching user reservations" });
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







module.exports = { placeReservation,verifyReservation, userReservations, fetchAllReservations };
