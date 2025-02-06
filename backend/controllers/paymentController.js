const axios = require('axios');
const { Payment } = require('../models/paymentModel');
const { User } = require('../models/userModel');
require('dotenv').config();

import paymongo from '@api/paymongo';

paymongo.auth('sk_test_1ZpWmQLmKjBuWB2AkUPz6qXf');
paymongo.createALink()
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));

const payMongoKey = process.env.PAYMONGO_SECRET_KEY;

const placePayment = async (req, res) => {
    const { amount, reservationItems } = req.body;

    console.log('PayMongo Secret Key:', payMongoKey); // Log the secret key for debugging
    console.log('Request Body:', req.body); // Log the request body for debugging

    try {
        // Create Payment Intent with PayMongo for GCash
        const paymentIntentResponse = await axios.post(
            'https://api.paymongo.com/v1/links', // Ensure this endpoint is correct
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

        console.log('Response from PayMongo:', paymentIntentResponse.data); // Log the response from PayMongo

        const paymentIntent = paymentIntentResponse.data.data;
        const paymongoPaymentIntentId = paymentIntent.id;

        // Create Payment Record
        const payment = await Payment.create({
            user_id: req.user.id,
            amount,
            reservation_item_id: reservationItems,
            paymongo_payment_intent_id: paymongoPaymentIntentId,
            status: 'pending'
        });

        // Update User if needed (example: increment payment count, etc.)
        await User.update(
            { last_payment_date: new Date() },
            { where: { id: req.user.id } }
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