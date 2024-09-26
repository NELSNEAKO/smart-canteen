import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Paper, CircularProgress, Alert, ListItemAvatar, Avatar } from '@mui/material';
import axios from 'axios';

function ViewAvailableFood() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food-items');
        const items = response.data.map(item => ({
          ...item,
          price: item.price ? parseFloat(item.price) : null, // Convert price to number or null
          imageUrl: item.image ? `http://localhost:5000/uploads/${item.image}` : null // Construct the image URL
        }));
        setFoodItems(items);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch food items.');
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Available Food Items
      </Typography>
      {foodItems.length === 0 ? (
        <Typography>No food items available.</Typography>
      ) : (
        <List>
          {foodItems.map((item) => (
            <ListItem key={item.id} divider>
              {item.imageUrl && (
                <ListItemAvatar>
                  <Avatar alt={item.name} src={item.imageUrl} />
                </ListItemAvatar>
              )}
              <ListItemText 
                primary={item.name} 
                secondary={`Price: ₱${item.price !== null ? item.price.toFixed(2) : 'N/A'}`} 
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default ViewAvailableFood;