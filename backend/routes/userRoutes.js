const express = require('express')
const {
    getAllUsers,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController') //import controller

const db = require('../config/db'); 
const userRouter = express.Router();


// Route for user registration
userRouter.post('/register', registerUser);

// Route for user login
userRouter.post('/login', loginUser);

// Route for getting user details
userRouter.get('/users', getAllUsers);

// Route for updating user details
userRouter.put('/update/:userId', updateUser);

// Route for deleting user
userRouter.delete('/delete/:userId', deleteUser);



module.exports = userRouter;