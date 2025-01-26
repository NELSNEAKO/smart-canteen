const express = require('express')
const {
    getUser,
    registerUser,
    loginUser,
} = require('../controllers/userController') //import controller

const db = require('../config/db'); 
const userRouter = express.Router();


// Route for user registration
userRouter.post('/register', registerUser);

// Route for user login
userRouter.post('/login', loginUser);

module.exports = userRouter;