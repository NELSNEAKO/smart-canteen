const express = require('express')
const {
    generateInviteCode,
    registerVendor,
    loginVendor,
    fetchInviteCodes,
    getVendor,
    deleteVendor,
} = require('../controllers/vendorController') //import controller

const db = require('../config/db'); 
const vendorRouter = express.Router();

// Route for invitation
vendorRouter.post('/invite', generateInviteCode);

// Route for registration
vendorRouter.post('/register', registerVendor);

// Route for registration
vendorRouter.post('/login', loginVendor);

// Route for fetching all invite codes
vendorRouter.get('/get-invite', fetchInviteCodes);

// route for all vendors
vendorRouter.get('/vendors', getVendor);

// route for deleting vendor
vendorRouter.delete('/delete/:vendorId', deleteVendor);


module.exports = vendorRouter;




