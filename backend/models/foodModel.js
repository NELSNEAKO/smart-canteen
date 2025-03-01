const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'Not Available'
  },
  availability: {
    type: String,
    required: true,
    default: 'Lunch'
  },
  image: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

const foodModel = mongoose.models.food || mongoose.model('Food', foodSchema);

module.exports = foodModel;