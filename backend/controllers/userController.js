const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

require('dotenv').config();

// Function to create JWT token
const createToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// 📌 Register Student
const registerUser = async (req, res) => {
  const { student_id, name, email, password } = req.body;

  if (!email || !student_id || !name || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ student_id, name, email, password: hashedPassword });

    await newUser.save();

    const token = createToken(newUser._id, 'student'); // 🔹 Token with 'student' role
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // 🔍 Find student by email (Mongoose query)
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    // 🔑 Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 🔹 Hardcode "student" in the token
    const token = jwt.sign(
      { id: user._id, userType: "student" }, // ✅ Mongoose uses `_id`
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token, userType: 'student' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find(); // ✅ Mongoose query
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error retrieving users' });
  }
};


// Update User
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { student_id, name, email, password } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

// Get User
const getUser = async (req, res) => {
  try {
    const { userId } = req.body; // Extracted from the token in authMiddleware

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getStudentData = async (req,res) => {
  try {
    const {studentId} = req.body;

    const student = await userModel.findById(studentId);

    if(!student){
      return res.json({success: false, message: 'Student not found'})
    }

    res.json({success: true,
      studentData: {
        name: student.name,
        isAccountVerified: student.isAccountVerified
      }
    });


  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    
  }
}

module.exports = { 
   loginStudent, 
   registerUser,
   getAllUsers, 
   updateUser, 
   deleteUser,
   getUser,
   getStudentData, 
  };