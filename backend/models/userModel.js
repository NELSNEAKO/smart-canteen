const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verifyOtp :{
    type: String,
    default: '' 
  },
  verifyOtpExpireAt :{
    type: Number,
    default: 0
  },
  isAccountVerified :{
    type: Boolean,
    default: false
  },
  resetOtp :{
    type: String,
    default: ''
  },
  resetOtpExpireAt :{
    type: Number,
    default: 0
  },
  cartData: {
    type: Object,
    default: {},
    validate: {
      validator: function (v) {
        return typeof v === 'object' && !Array.isArray(v); // ✅ Ensure cartData is an object, not an array
      },
      message: 'cartData must be an object, not an array'
    }
  }
}, { minimize: false });

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = userModel;
