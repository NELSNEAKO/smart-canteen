const axios = require('axios');
const { Payment } = require('../models/paymentModel');
const { User } = require('../models/userModel');
const { Reservation } = require('../models/reservationModel'); // Import Reservation model
require('dotenv').config();

const payMongoKey = process.env.PAYMONGO_SECRET_KEY;

const placePayment = async (req, res) => {
    const { amount } = req.body;

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
        // ✅ Automatically fetch all reserved food items for the user
        const reservations = await Reservation.findAll({
            where: { user_id: req.body.userId }
        });

        if (reservations.length === 0) {
            return res.status(400).json({ message: 'No reservations found for payment' });
        }

        // Extract item IDs or details (modify based on your database structure)
        const reservationItems = reservations.map(r => r.id); // Assuming reservation has an ID

        // Define the success URL
        const successUrl = `https://yourwebsite.com/payment-success?userId=${req.body.userId}`;

        // Create Payment Intent with PayMongo for GCash
        const paymentIntentResponse = await axios.post(
            'https://api.paymongo.com/v1/payment_intents',
            {
                data: {
                    attributes: {
                        amount: amount * 100, // Convert to cents if needed
                        currency: 'PHP',
                        payment_method_allowed: ['gcash'],
                        capture_type: 'automatic',
                        success_url: successUrl // ✅ Added success URL
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

        console.log('Response from PayMongo:', paymentIntentResponse.data);

        const paymentIntent = paymentIntentResponse.data.data;
        const paymongoPaymentIntentId = paymentIntent.id;

        // Create Payment Record
        const payment = await Payment.create({
            user_id: req.body.userId,
            amount,
            reservation_item_id: reservationItems,
            paymongo_payment_intent_id: paymongoPaymentIntentId,
            status: 'pending' // Initially set to pending
        });

        // Update User
        await User.update(
            { last_payment_date: new Date() },
            { where: { id: req.body.userId } }
        );

        // ✅ Clear reservation data after successful payment
        const paymentStatus = paymentIntent.attributes.status;

        if (paymentStatus === 'succeeded') { // Ensure payment is completed
            await Reservation.update(
                { status: 'completed', items: null }, // Mark as completed and clear items
                { where: { user_id: req.body.userId } }
            );

            // ✅ Update payment status to "completed"
            await Payment.update(
                { status: 'completed' },
                { where: { id: payment.id } }
            );
        }

        res.status(201).json({
            message: 'Payment intent created successfully',
            paymentIntent: paymentIntent.attributes.client_key,
            success_url: successUrl, // ✅ Return the success URL
            payment
        });
    } catch (error) {
        console.error('Error placing payment:', error);

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
