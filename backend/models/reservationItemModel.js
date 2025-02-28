const mongoose = require('mongoose');

const reservationItemSchema = new mongoose.Schema(
  {
    reservation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation', // Reference to the Reservation model
      default: null // ✅ Prevent orphaned items when reservations are deleted
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'food', // Reference to the Food model (assuming your food model is named 'food')
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    deleted_at: {
      type: Date,
      default: null // ✅ Soft delete support
    }
  },
  {
    timestamps: true // ✅ Auto handles createdAt & updatedAt
  }
);

// Soft delete helper method
reservationItemSchema.methods.softDelete = function () {
  this.deleted_at = new Date();
  return this.save();
};

const ReservationItem = mongoose.models.ReservationItem || mongoose.model('ReservationItem', reservationItemSchema);

module.exports = ReservationItem;
