const axios = require('axios');
const { Payment } = require('../models/paymentModel');
const { User } = require('../models/userModel');
require('dotenv').config();

const payMongoKey = process.env.PAYMONGO_SECRET_KEY;

const placePayment = async (req, res) => {
    const { amount, reservationItems } = req.body;

    try {
        // Create Payment Intent with PayMongo for GCash
        const paymentIntentResponse = await axios.post(
            'https://api.paymongo.com/v1/payment_intents',
            {
                data: {
                    attributes: {
                        amount: amount * 100, // Convert to cents if needed
                        currency: 'PHP',
                        payment_method_allowed: ['gcash'],
                        capture_type: 'automatic'
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${payMongoKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const paymentIntent = paymentIntentResponse.data.data;
        const paymongoPaymentIntentId = paymentIntent.id;

        // Create Payment Record
        const payment = await Payment.create({
            userId: req.user.userId,
            amount,
            reservationItems,
            paymongoPaymentIntentId,
            status: 'pending'
        });

        // Update User if needed (example: increment payment count, etc.)
        await User.update(
            { lastPaymentDate: new Date() }, // Example field update
            { where: { id: req.user.userId } }
        );

        res.status(201).json({
            message: 'Payment intent created successfully',
            paymentIntent: paymentIntent.attributes.client_key,
            payment
        });
    } catch (error) {
        console.error('Error placing payment:', error);
        res.status(500).json({
            message: 'Failed to place payment',
            error: error.message
        });
    }
};

module.exports = {
    placePayment,
};