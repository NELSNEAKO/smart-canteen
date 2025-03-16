const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  items: [{ 
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    foodName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  amount: { type: Number, required: true }, // ✅ Full price stored
  paidAmount: { type: Number, required: true, default: 0 }, // ✅ Store initial 50% paid
  remainingBalance: { type: Number, required: true, default: 0 }, // ✅ Store remaining 50%
  status: { type: String, default: 'Food Processing' }, // ✅ Update status dynamically
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false } // ✅ Can update to true when fully paid
},{ strictPopulate: false });

const reservationModel = mongoose.models.reservation || mongoose.model('Reservation', reservationSchema);

module.exports = reservationModel;
