const axios = require('axios');
const { Payment } = require('../models/paymentModel');
const { User } = require('../models/userModel');
const { Reservation } = require('../models/reservationModel');
const { ReservationItem } = require('../models/reservationItemModel');
const { FoodItem } = require('../models/foodModel');

require('dotenv').config();

const payMongoKey = process.env.PAYMONGO_SECRET_KEY;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const placePayment = async (req, res) => {
    const { amount, userId } = req.body; // Ensure correct parameters

    if (!userId) return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    if (!payMongoKey) return res.status(500).json({ message: 'PayMongo secret key not found' });

    try {
        console.log(`✅ Processing payment for user: ${userId}`);

        // Fetch reservations and ensure Payment records properly
        const userReservations = await Reservation.findAll({
            where: { user_id: userId },
            include: [{
                model: ReservationItem,
                as: 'ReservationItems',
                attributes: ['id', 'quantity'],
                include: [{ model: FoodItem, as: 'FoodItem', attributes: ['name', 'price', 'description'] }]
            }]
        });

        // Extract reservationItem IDs
        const reservationItemIds = userReservations.flatMap(r => r.ReservationItems.map(item => item.id)).filter(Boolean);

        if (reservationItemIds.length === 0) {
            return res.status(400).json({ message: 'No reservation items found for payment' });
        }

        console.log("Fetched reservation items:", reservationItemIds);

        const reservationItemId = reservationItemIds[0];
        console.log("Valid reservation item ID:", reservationItemId);

        const successUrl = `${frontendUrl}/verify?success=true&userId=${userId}`;
        const cancelUrl = `${frontendUrl}/verify?success=false&userId=${userId}`;

        // ✅ Ensure proper mapping of reservation items
        const lineItems = userReservations.flatMap(r =>
            r.ReservationItems.map(item => ({
                name: item.FoodItem?.name || 'Food item',
                amount: Number(item.FoodItem?.price || 0) * 100,
                currency: 'PHP',
                description: item.FoodItem?.description || "Food item",
                quantity: item.quantity || 1
            }))
        );

        console.log("🛒 Reservation Items:", JSON.stringify(lineItems, null, 2));

        const requestData = {
            data: {
                attributes: {
                    line_items: lineItems,
                    show_description: false,
                    payment_method_types: ['card', 'gcash'],
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                }
            }
        };

        console.log("🚀 Sending PayMongo Request Data:", JSON.stringify(requestData, null, 2));

        // Send request to PayMongo
        const checkoutResponse = await axios.post(
            'https://api.paymongo.com/v1/checkout_sessions',
            requestData,
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(payMongoKey + ':').toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const checkoutSession = checkoutResponse.data.data;
        const paymongoCheckoutSessionId = checkoutSession.id;

        console.log(`✅ PayMongo session created: ${paymongoCheckoutSessionId}`);

        // ✅ Ensure payment is created correctly
        try {
            const payment = await Payment.create({
                user_id: userId,
                amount,
                reservation_item_id: reservationItemId,
                paymongo_checkout_session_id: paymongoCheckoutSessionId,
                payment_status: false,  // ⬅️ BOOLEAN, not string!
                status: 'Pending' // ⬅️ This is the correct place for 'Food Processing'
            });
            

            console.log("✅ Payment record saved:", payment.toJSON()); // Debug log
        } catch (error) {
            console.error("❌ Error saving payment:", error);
        }

        // ✅ Update last payment date
        await User.update(
            { last_payment_date: new Date() },
            { where: { id: userId } }
        );

        // 🚨 Ensure reservations are NOT deleted before checking the DB
        // // Comment this out if you want to check if records are missing after payment.
        // await Reservation.destroy({ where: { user_id: userId } });
        // console.log(`🗑️ Cleared reservations for user: ${userId}`);

        res.status(201).json({
            message: 'Checkout session created successfully',
            checkoutUrl: checkoutSession.attributes.checkout_url
        });
    } catch (error) {
        console.error("❌ Error placing payment:", error);

        if (error.response && error.response.data) {
            console.error("❌ PayMongo API Error Response:", JSON.stringify(error.response.data, null, 2));
            return res.status(500).json({
                message: 'PayMongo API error',
                error: error.response.data
            });
        }

        res.status(500).json({
            message: 'Failed to place payment',
            error: error.message
        });
    }
};

/**
 * 2️⃣ **Verify payment after user is redirected from PayMongo**
 */
const verifyReservation = async (req, res) => {
    const { userId, success } = req.body; // Ensure frontend sends correct data

    try {
        // Find the latest payment entry for this user
        const payment = await Payment.findOne({ 
            where: { user_id: userId }, 
            order: [['created_at', 'DESC']] // ✅ Works because we explicitly defined `created_at`
        });
        
        if (!payment) {
            return res.json({ success: false, message: 'No payment found' });
        }

        if (success === "true") {
            // ✅ Update the payment status to true
            await Payment.update(
                { payment_status: true, status: 'Food Processing' }, 
                { where: { id: payment.id } }
            );

            // ✅ Clear reservations after successful payment
            await Reservation.destroy({ where: { user_id: userId } });

            console.log(`✅ Payment verified! Updated status for Payment ID: ${payment.id}`);

            res.json({ success: true, message: 'Payment verified and reservation cleared' });
        } else {
            // ❌ Delete the payment record if payment failed
            await Payment.destroy({ where: { id: payment.id } });
            console.log(`❌ Payment failed! Deleted record for Payment ID: ${payment.id}`);

            res.json({ success: false, message: 'Payment failed, record removed' });
        }
    } catch (error) {
        console.error('❌ Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { placePayment, verifyReservation };