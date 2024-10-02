const express = require('express')
const {
    getUser,
    registerUser,
    loginUser,
} = require('../controllers/userController') //import controller

const db = require('../config/db'); 
const router = express.Router();

// Route to retrieve all users
router.get('/get-user', getUser);

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

module.exports = router;