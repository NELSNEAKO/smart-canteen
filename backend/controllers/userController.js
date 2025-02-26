const { User } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');


// Function to create JWT token
const createToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// 📌 Register Student
const registerUser = async (req, res) => {
  const { student_id, name, email, password } = req.body;

  if (!email || !student_id || !name || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.json({ success: false, message: 'Email already exists' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ student_id, name, email, password: hashedPassword });

    const token = createToken(newUser.id, 'student'); // 🔹 Token with 'student' role
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Server error' });
  }
};


// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate if email and password are present
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token with expiration & userType
    const token = jwt.sign(
      { id: user.id, userType: 'student' }, // You can adjust userType if needed
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Respond with success and token
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
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