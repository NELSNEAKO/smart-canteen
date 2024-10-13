import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Paper, Box, Alert } from '@mui/material';
import axios from 'axios';

function DeleteFoodItem() {
  const [foodId, setFoodId] = useState('');
  const [foodName, setFoodName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [foodItems, setFoodItems] = useState([]); // State to hold the list of food items

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Fetch the food items when the component mounts
  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/food-items');
      setFoodItems(response.data); // Assuming response.data contains the food items
    } catch (err) {
      setError('Failed to fetch food items.');
    }
  };


  const handleDelete = async (e) => {

    try {
      await axios.delete(`http://localhost:5000/api/food-items/${foodId}`, {
        data: { name: foodName }, // Passing the name in the request body
      });

     
      await fetchFoodItems(); // Fetch foodItems again after a deletion

      setSuccess('Food item deleted successfully!');
      setFoodId('');
      setFoodName('');
      setError('');
      
    } catch (err) {
      setError('Failed to delete food item.');
      setSuccess('');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Delete Food Item
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleDelete} noValidate sx={{ mt: 2 }}>
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
        <Button type="submit" variant="contained" color="error" onDelete={handleDelete} fullWidth sx={{ mt: 2 }}>
          Delete Item
        </Button>
      </Box>
      {/* Optionally, display the remaining food items */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Remaining Food Items
      </Typography>
      <ul>
        {foodItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </Paper>
  );
}

export default DeleteFoodItem;
