import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, List, ListItem } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setStudentId(decodedToken.student_id); // Assuming student_id is in the token
    }
  }, []);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      message: inputMessage,
      sender: 'user', // Assuming the sender is always 'user' for this chat
      student_id: studentId, // Include student_id in the message
    };

    // Add user's message to the chat
    setMessages([...messages, newMessage]);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      };

      // Send message to the backend for processing or storing
      const response = await axios.post('/api/post-feedback', newMessage, config); // Include headers in the request

      // Add the response from the backend to the chat (simulating support response)
      setMessages([...messages, newMessage, { message: response.data.message, sender: 'support' }]);
    } catch (error) {
      console.error('Error sending message', error);
      // Optionally show an error message to the user
      setMessages([...messages, newMessage, { message: 'Error sending message. Please try again.', sender: 'support' }]);
    }

    setInputMessage(''); // Clear input field
  };

  return (
    <Box sx={{ width: '400px', border: '1px solid #ccc', padding: '10px' }}>
      <Typography variant="h6">Feedback Chat</Typography>
      <List sx={{ height: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
        {messages.map((msg, index) => (
          <ListItem key={index} sx={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <Typography variant="body2" color={msg.sender === 'user' ? 'primary' : 'textSecondary'}>
              {msg.message}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', marginTop: '10px' }}>
        <TextField
          variant="outlined"
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your feedback..."
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: '10px' }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
