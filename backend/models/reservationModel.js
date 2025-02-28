const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Object, required: true },
  amount : { type: Number, required: true },
  status: { type: String, default: 'Food Processing' },
  data: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false }
});

const reservationModel = mongoose.model('reservation', reservationSchema);

module.exports = reservationModel;
