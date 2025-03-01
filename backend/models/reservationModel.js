const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  items: [{ 
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true }, // Make sure it references 'Food'
    foodName: { type: String, required: true }, // ✅ Ensure this exists
    quantity: { type: Number, required: true, default: 1 } // Ensure quantity is required
  }],
  amount: { type: Number, required: true },
  status: { type: String, default: 'Food Processing' },
  date: { type: Date, default: Date.now }, // Corrected "data" to "date"
  payment: { type: Boolean, default: false }
});

const reservationModel = mongoose.models.reservation || mongoose.model('Reservation', reservationSchema);

module.exports = reservationModel;
