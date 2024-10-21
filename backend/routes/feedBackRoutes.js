const express = require('express')
const {
    getFeedbackMessages,
    createFeedbackMessage,
} = require('../controllers/feedBackController') //import controller

const db = require('../config/db'); 
const router = express.Router();

// Route to retrieve all feedback
router.get('/get-feedback', getFeedbackMessages);

// Route to post message
router.post('/post-feedback', getFeedbackMessages);


module.exports = router;