import React, { useState } from 'react';
import { Typography, TextField, Button, Paper, Box, Alert } from '@mui/material';
import axios from 'axios';

function AddFoodItem() {
  const [foodId, setFoodId] = useState('');
  const [foodName, setFoodName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);  // State for the image file
  const [status, setStatus] = useState('Not Available');  // New state for availability status
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', foodId);  // Append Food ID to form data
    formData.append('name', foodName);
    formData.append('price', price);
    formData.append('status', status);  // Append the status (Available/Not Available)
    formData.append('image', image);  // Append the image file to the form data

    try {
      await axios.post('http://localhost:5000/api/food-items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Food item added successfully!');
      setFoodId('');
      setFoodName('');
      setPrice('');
      setImage(null);
      setStatus('Not Available');  // Reset status to default
      setError('');
    } catch (err) {
      setError('Failed to add food item.');
      setSuccess('');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Add Food Item
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleAdd} noValidate sx={{ mt: 2 }}>
        <TextField
          label="Food ID"
          variant="outlined"
          fullWidth
          required
          value={foodId}
          onChange={(e) => setFoodId(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Food Name"
          variant="outlined"
          fullWidth
          required
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Price (₱)"
          variant="outlined"
          type="number"
          fullWidth
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          margin="normal"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}  // Handle image file selection
          style={{ margin: '20px 0' }}  // Add some margin to the input field
        />
        {/* Buttons for Available and Not Available status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant={status === 'Available' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setStatus('Available')}
            sx={{ width: '48%' }}
          >
            Available
          </Button>
          <Button
            variant={status === 'Not Available' ? 'contained' : 'outlined'}
            color="secondary"
            onClick={() => setStatus('Not Available')}
            sx={{ width: '48%' }}
          >
            Not Available
          </Button>
        </Box>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Add Item
        </Button>
      </Box>
    </Paper>
  );
}

export default AddFoodItem;