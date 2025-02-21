const express = require('express')
const {
    generateInviteCode,
    registerVendor,
    loginVendor
} = require('../controllers/vendorController') //import controller

const db = require('../config/db'); 
const vendorRouter = express.Router();

// Route for invitation
vendorRouter.post('/invite', generateInviteCode);

// Route for registration
vendorRouter.post('/register', registerVendor);

// Route for registration
vendorRouter.post('/login', loginVendor);

module.exports = vendorRouter;




