// const axios = require('axios');
// const { Payment } = require('../models/paymentModel');
// const { User } = require('../models/userModel');
// const { Reservation } = require('../models/reservationModel');
// const { ReservationItem } = require('../models/reservationItemModel');
// const { FoodItem } = require('../models/foodModel');
// const { sequelize } = require('../models/userModel'); // ✅ Ensure a single DB connection

// require('dotenv').config();

// const payMongoKey = process.env.PAYMONGO_SECRET_KEY;
// const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

// /**
//  * ✅ **Handles payment creation & PayMongo checkout session**
//  */
// const placePayment = async (req, res) => {
//     const { amount, userId } = req.body;

//     if (!userId) return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
//     if (!payMongoKey) return res.status(500).json({ message: 'PayMongo secret key not found' });
    
//     try {
//         console.log(`✅ Processing payment for user: ${userId}`);

//         // 🏷️ Fetch reservations with reservation items in one optimized query
//         const userReservations = await Reservation.findAll({
//             where: { user_id: userId },
//             include: [{
//                 model: ReservationItem,
//                 as: 'ReservationItems',
//                 attributes: ['id', 'quantity'],
//                 include: [{ model: FoodItem, as: 'FoodItem', attributes: ['name', 'price', 'description'] }]
//             }]
//         });

//         if (!userReservations.length) {
//             return res.status(400).json({ message: 'No reservation items found for payment' });
//         }

//         // 🏷️ Extract first reservationItem ID (assuming one payment per order)
//         const reservationItemId = userReservations[0]?.ReservationItems[0]?.id;
//         if (!reservationItemId) {
//             return res.status(400).json({ message: 'No valid reservation item found' });
//         }

//         console.log(`🛒 Valid reservation item ID: ${reservationItemId}`);

//         // ✅ Construct line items for PayMongo
//         const lineItems = userReservations.flatMap(reservation =>
//             reservation.ReservationItems.map(item => ({
//                 name: item.FoodItem?.name || 'Food item',
//                 amount: Number(item.FoodItem?.price || 0) * 100,
//                 currency: 'PHP',
//                 description: item.FoodItem?.description || "Food item",
//                 quantity: item.quantity || 1
//             }))
//         );

//         console.log("🚀 Sending PayMongo Request Data:", JSON.stringify(lineItems, null, 2));

//         // ✅ Call PayMongo API
//         const checkoutResponse = await axios.post(
//             'https://api.paymongo.com/v1/checkout_sessions',
//             { data: { attributes: { line_items: lineItems, payment_method_types: ['card', 'gcash'], success_url: `${frontendUrl}/verify?success=true&userId=${userId}`, cancel_url: `${frontendUrl}/verify?success=false&userId=${userId}` } } },
//             { headers: { Authorization: `Basic ${Buffer.from(payMongoKey + ':').toString('base64')}`, 'Content-Type': 'application/json' } }
//         );

//         const paymongoCheckoutSessionId = checkoutResponse.data.data.id;
//         console.log(`✅ PayMongo session created: ${paymongoCheckoutSessionId}`);

//         // ✅ Create payment in the database using a transaction for safety
//         await sequelize.transaction(async (t) => {
//             await Payment.create({
//                 user_id: userId,
//                 amount,
//                 reservation_item_id: reservationItemId,
//                 paymongo_checkout_session_id: paymongoCheckoutSessionId,
//                 payment_status: false,
//                 status: 'Pending'
//             }, { transaction: t });

//             await User.update({ last_payment_date: new Date() }, { where: { id: userId }, transaction: t });
//         });

//         res.status(201).json({ message: 'Checkout session created successfully', checkoutUrl: checkoutResponse.data.data.attributes.checkout_url });

//     } catch (error) {
//         console.error("❌ Error placing payment:", error);
//         return res.status(500).json({ message: 'Failed to place payment', error: error?.response?.data || error.message });
//     }
// };

// /**
//  * ✅ **Verifies the payment and updates the database**
//  */
// const verifyReservation = async (req, res) => {
//     const { userId, success } = req.body;

//     if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

//     try {
//         // 🏷️ Find the latest payment entry for this user
//         const payment = await Payment.findOne({
//             where: { user_id: userId },
//             order: [['created_at', 'DESC']]
//         });

//         if (!payment) {
//             return res.json({ success: false, message: 'No payment found' });
//         }

//         if (success === "true") {
//             // ✅ Update payment status & clear reservations using transaction
//             await sequelize.transaction(async (t) => {
//                 await Payment.update(
//                     { payment_status: true, status: 'Food Processing' },
//                     { where: { id: payment.id }, transaction: t }
//                 );

//                 await Reservation.destroy({ where: { user_id: userId }, transaction: t });
//             });

//             console.log(`✅ Payment verified! Updated status for Payment ID: ${payment.id}`);
//             return res.json({ success: true, message: 'Payment verified and reservation cleared' });

//         } else {
//             // ❌ update the payment status to "Failed"
//             await Payment.update(
//                 { payment_status: false, status: 'Failed' }, // ✅ Track failed payments
//                 { where: { id: payment.id } }
//             );

//             return res.json({ success: false, message: 'Payment failed, record removed' });
//         }
//     } catch (error) {
//         console.error('❌ Error verifying payment:', error);
//         return res.status(500).json({ success: false, message: 'Server error' });
//     }
// };


// const userReservations = async (req, res) => {
//     try {
//         const reservations = await Reservation.findAll({
//             where: { user_id: req.body.userId },
//             paranoid: false, // ✅ Ensure we get soft-deleted data if needed
//             include: [
//                 {
//                     model: ReservationItem,
//                     as: "ReservationItems",
//                     include: [
//                         {
//                             model: FoodItem,
//                             as: "FoodItem"
//                         },
//                         {
//                             model: Payment,
//                             as: "Payment"
//                         }
//                     ]
//                 }
//             ]
//         });

//         // ✅ Filter out reservations where ALL payments are failed
//         const filteredReservations = reservations.filter((reservation) =>
//             reservation.ReservationItems?.some(
//                 (item) => item.Payment?.status !== "Failed"
//             )
//         );

//         res.json({ success: true, data: filteredReservations });
//     } catch (error) {
//         console.error("Error fetching reservations:", error);
//         res.status(500).json({ success: false, message: "Error fetching reservations" });
//     }
// };

// const listReservations = async (req, res) => {
//     try {
//         const reservations = await Reservation.findAll({
//             paranoid: false, // ✅ Ensure we get soft-deleted data if needed
//             include: [
//                 {
//                     model: ReservationItem,
//                     as: "ReservationItems",
//                     include: [
//                         {
//                             model: FoodItem,
//                             as: "FoodItem"
//                         },
//                         {
//                             model: Payment,
//                             as: "Payment"
//                         }
//                     ]
//                 },
//                 {
//                     model: User,
//                     as: "User",
//                     attributes: ["student_id", "name", "email"]
//                 }
//             ]
//         });

//         res.json({ success: true, data: reservations });
//     } catch (error) {
//         console.error("Error fetching reservations:", error);
//         res.status(500).json({ success: false, message: "Error fetching reservations" });
//     }
// }

// const vendorListReservation = async (req, res) => {
//     try {
//         const reservations = await Reservation.findAll({
//             paranoid: false, // Ensure we get soft-deleted data if needed
//             include: [
//                 {
//                     model: ReservationItem,
//                     as: "ReservationItems",
//                     include: [
//                         {
//                             model: FoodItem,
//                             as: "FoodItem"
//                         },
//                         {
//                             model: Payment,
//                             as: "Payment"
//                         }
//                     ]
//                 },
//                 {
//                     model: User,
//                     as: "User",
//                     attributes: ["student_id", "name", "email"]
//                 }
//             ]
//         });

//         // ✅ Ensure only reservations with valid payments are returned
//         const filteredReservations = reservations.filter((reservation) =>
//             reservation.ReservationItems?.some(
//                 (item) => item.Payment && item.Payment.payment_status !== 0 // Explicitly check for 0 (false)
//             )
//         );

//         res.json({ success: true, data: filteredReservations });
//     } catch (error) {
//         console.error("Error fetching reservations:", error);
//         res.status(500).json({ success: false, message: "Error fetching reservations" });
//     }
// };


// const updateStatus = async (req, res) => {
//     try {
//         // Find the payment record by primary key (ID)
//         const payment = await Payment.findByPk(req.body.paymentId);

//         if (!payment) {
//             return res.status(404).json({ success: false, message: "Payment record not found" });
//         }

//         // Update the status field
//         await payment.update({ status: req.body.status });

//         res.json({ success: true, message: "Status Updated" });
//     } catch (error) {
//         console.error("Error updating status:", error);
//         res.status(500).json({ success: false, message: "Error updating status" });
//     }
// };



// module.exports = {
//      placePayment,
//      verifyReservation, 
//      userReservations, 
//      listReservations,
//      updateStatus,
//      vendorListReservation,
// };
