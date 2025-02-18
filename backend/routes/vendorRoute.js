const express = require('express')
const {
    generateInviteCode,
} = require('../controllers/vendorController') //import controller

const db = require('../config/db'); 
const vendorRouter = express.Router();

// Route for invitation
vendorRouter.post('/invite', generateInviteCode);

module.exports = vendorRouter;




