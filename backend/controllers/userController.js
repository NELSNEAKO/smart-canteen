const { User } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};


// Register user
const registerUser = async (req, res) => {
  const { student_id, name, email, password } = req.body;

  // Validate if email and other fields are present
  if (!email || !student_id || !name || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.json({ success: false, message: 'Email already exists' });
    }

    // Validate email format and password strength
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 5) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      student_id,
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Create token
    const token = createToken(newUser.id);

    // Respond with success and token
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate if email and password are present
  if (!email || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = createToken(user.id);

    // Respond with success and token
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

module.exports = { loginUser, registerUser };