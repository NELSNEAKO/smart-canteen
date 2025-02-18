const express = require('express')
const {
    generateInviteCode,
    registerVendor,
} = require('../controllers/vendorController') //import controller

const db = require('../config/db'); 
const vendorRouter = express.Router();

// Route for invitation
vendorRouter.post('/invite', generateInviteCode);

// Route for registration
vendorRouter.post('/register', registerVendor);

module.exports = vendorRouter;




