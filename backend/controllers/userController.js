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

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error retrieving users' });
  }
};

// Update user details
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { student_id, name, email, password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Update user fields
    user.student_id = student_id || user.student_id;
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

const getUser = async (req, res) => {
  try {
      const userId = req.body.userId; // Extracted from the token in authMiddleware

      // Fetch user data from the database
      const user = await User.findByPk(userId); // Assuming Sequelize, modify if using another ORM

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, user });
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { 
   loginUser, 
   registerUser,
   getAllUsers, 
   updateUser, 
   deleteUser,
   getUser 
  };