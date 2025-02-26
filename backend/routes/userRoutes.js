const express = require('express')
const {
    getAllUsers,
    registerUser,
    loginStudent,
    updateUser,
    deleteUser,
    getUser,
} = require('../controllers/userController') //import controller
const authMiddleware = require('../middleware/auth');


const db = require('../config/db'); 
const userRouter = express.Router();


// Route for user registration
userRouter.post('/register', registerUser);

// Route for user login
userRouter.post('/login', loginStudent);

// Route for getting user details
userRouter.get('/users', getAllUsers);

// Route for getting specific user
userRouter.get('/user', authMiddleware, getUser);

// Route for updating user details
userRouter.put('/update/:userId', updateUser);

// Route for deleting user
userRouter.delete('/delete/:userId', deleteUser);



module.exports = userRouter;