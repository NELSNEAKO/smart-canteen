const axios = require('axios');
const { Payment } = require('../models/paymentModel');
const { User } = require('../models/userModel');
require('dotenv').config();

const payMongoKey = process.env.PAYMONGO_SECRET_KEY;

const placePayment = async (req, res) => {
    const { amount, reservationItems } = req.body;

    console.log('PayMongo Secret Key:', payMongoKey); // Log the secret key for debugging
    console.log('Request Body:', req.body); // Log the request body for debugging

    // Check if userId is in the request body (set by authMiddleware)
    if (!req.body.userId) {
        return res.status(401).json({
            message: 'Unauthorized: User not authenticated'
        });
    }

    if (!payMongoKey) {
        return res.status(500).json({
            message: 'PayMongo secret key not found in environment variables'
        });
    }

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
                    Authorization: `Basic ${Buffer.from(payMongoKey + ':').toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Response from PayMongo:', paymentIntentResponse.data); // Log the response from PayMongo

        const paymentIntent = paymentIntentResponse.data.data;
        const paymongoPaymentIntentId = paymentIntent.id;

        // Create Payment Record
        const payment = await Payment.create({
            user_id: req.body.userId, // Use userId from req.body
            amount,
            reservation_item_id: reservationItems,
            paymongo_payment_intent_id: paymongoPaymentIntentId,
            status: 'pending'
        });

        // Update User if needed (example: increment payment count, etc.)
        await User.update(
            { last_payment_date: new Date() },
            { where: { id: req.body.userId } } // Use userId from req.body
        );

        res.status(201).json({
            message: 'Payment intent created successfully',
            paymentIntent: paymentIntent.attributes.client_key,
            payment
        });
    } catch (error) {
        console.error('Error placing payment:', error);

        // Handle specific Sequelize errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
        }

        res.status(500).json({
            message: 'Failed to place payment',
            error: error.message
        });
    }
};

module.exports = {
    placePayment,
};
