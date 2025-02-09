const axios = require('axios');
const { Payment } = require('../models/paymentModel');
const { User } = require('../models/userModel');
const { Reservation } = require('../models/reservationModel');
require('dotenv').config();

const payMongoKey = process.env.PAYMONGO_SECRET_KEY;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const placePayment = async (req, res) => {
    const { amount, userId, reservationItems } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    if (!amount) return res.status(400).json({ message: 'Bad Request: Amount is required' });
    if (!payMongoKey) return res.status(500).json({ message: 'PayMongo secret key not found' });

    try {
        console.log(`✅ Processing payment for user: ${userId}, Amount: ${amount}`);

        if (!reservationItems || reservationItems.length === 0) {
            return res.status(400).json({ message: 'No reservation items found for payment' });
        }

        const reservations = await Reservation.findAll({ where: { user_id: userId } });
        if (!reservations || reservations.length === 0) {
            return res.status(400).json({ message: 'No reservations found for payment' });
        }

        const reservationItemIds = reservations.map(r => r.id);
        const successUrl = `${frontendUrl}/success?userId=${userId}`;
        const cancelUrl = `${frontendUrl}/cancel?userId=${userId}`;

        console.log("🛒 Reservation Items:", JSON.stringify(reservationItems, null, 2));

        const lineItems = reservationItems.map(item => ({
            name: item.description || 'Food item',
            amount: Number(item.price) * 100,
            currency: 'PHP',
            description: item.description || "Food item",
            quantity: item.quantity || 1,
        }));

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

        const payment = await Payment.create({
            user_id: userId,
            amount,
            reservation_item_id: reservationItemIds[0],
            paymongo_checkout_session_id: paymongoCheckoutSessionId,
            status: 'pending'
        });

        await User.update(
            { last_payment_date: new Date() },
            { where: { id: userId } }
        );

        // ✅ Clear reservations after payment is processed
        await Reservation.destroy({ where: { user_id: userId } });
        console.log(`🗑️ Cleared reservations for user: ${userId}`);

        res.status(201).json({
            message: 'Checkout session created successfully',
            checkoutUrl: checkoutSession.attributes.checkout_url,
            payment
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

module.exports = { placePayment };
