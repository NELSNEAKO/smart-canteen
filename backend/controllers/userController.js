const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// User Registration
const registerUser = (req, res) => {
  const { student_id, username, email, password, role } = req.body;

  // Validate input fields
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  // Ensure that the role is either 'student' or 'vendor'
  if (role !== 'student' && role !== 'vendor') {
    return res.status(400).json({ message: 'Invalid role. Role must be either student or vendor' });
  }

  // For students, student_id is mandatory
  if (role === 'student' && !student_id) {
    return res.status(400).json({ message: 'Student ID is required for students' });
  }
  
  // Check if the user already exists in the database
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ message: 'Database error occurred' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const insertUserQuery = 'INSERT INTO users (student_id, username, email, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(
      insertUserQuery,
      [role === 'student' ? student_id : null, username, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ message: 'Database error occurred' });
        }

        // Generate and return a JWT token
        const token = jwt.sign(
          { id: result.insertId, role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User registered successfully', token });
      }
    );
  });
};

// User Login
const loginUser = (req, res) => {
  const { username, password } = req.body;

  // Validate input fields
  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  // Check if the user exists in the database
  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserQuery, [username], async (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ message: 'Database error occurred' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate and return a JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, student_id: user.student_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  });
};

const getUser = (req, res) => {
  const checkUserQuery = 'SELECT * FROM users';

  db.query(checkUserQuery, async (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ message: err.message }); // Return the actual error message
    } 
    // If no error, send the results
    return res.status(200).json(results); // Send the users as a response
  });
};

  
module.exports = {
  registerUser,
  loginUser,
  getUser,
};
