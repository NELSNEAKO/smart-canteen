const express = require('express')

const {
    studentRegister,
    studentLogin,
    logout
} = require('../controllers/authController');

const authRouter = express.Router();


authRouter.post('/register', studentRegister);

authRouter.post('/login', studentLogin);

authRouter.post('/logout', logout);

module.exports = authRouter;





