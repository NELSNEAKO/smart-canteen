const db = require('../config/db');

const getFeedbackMessages = (req, res) => {
    const selectQuery = 'SELECT * FROM feedback ORDER BY created_at ASC'; // Query to select all feedback messages
  
    db.query(selectQuery, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error while retrieving feedback messages' });
      }
  
      // If no messages are found, you can send an empty array or a specific message
      if (results.length === 0) {
        return res.status(200).json({ message: 'No feedback messages found', feedback: [] });
      }
  
      res.status(200).json({ feedback: results }); // Send the retrieved messages as a response
    });
  };
  

  const createFeedbackMessage = (req, res) => {
    const { message, sender } = req.body; // Extract message and sender from the request body
  
    // Validate input
    if (!message || !sender) {
      return res.status(400).json({ message: 'Message and sender are required' });
    }
  
    const insertQuery = 'INSERT INTO feedback (message, sender) VALUES (?, ?)'; // SQL query to insert a new feedback message
  
    db.query(insertQuery, [message, sender], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error while inserting feedback' });
      }
  
      res.status(201).json({ message: 'Feedback message created successfully', feedbackId: result.insertId }); // Respond with success message and new feedback ID
    });
  };
  module.exports = { 
    getFeedbackMessages,
    createFeedbackMessage,
  };