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
  cartData: {type: Object , default: {}}
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);


module.exports = userModel;
