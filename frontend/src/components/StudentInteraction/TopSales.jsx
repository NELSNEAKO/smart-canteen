import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Avatar,
  CircularProgress,
} from '@mui/material';

export default function TopSales() {
  const [topSales, setTopSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch top sales data
  const fetchTopSales = () => {
    setLoading(true);
    setError(null);

    axios.get(`http://localhost:5000/api/get-top-sales`)
      .then(response => {
        //console.log('API Response:', response.data); // Log the whole response
        setTopSales(response.data.topSales);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching top sales:', err.message);
        setError('Failed to load top sales data. Please try again.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTopSales();
  }, []);

  // Display loading spinner while fetching data
  if (loading) {
    return <CircularProgress />;
  }

  // Display an error message if fetching fails
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  
  //console.log('sales:', topSales);
  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Top Sales
      </Typography>
      {topSales.length === 0 ? (
        <Typography>No Top Sales</Typography>
      ) : (
        <List>
          {topSales.map((sales) => (
            <ListItem key={sales.id} divider>
              <Avatar alt={sales.foodName} src={sales.imageUrl} style={{ marginRight: '10px' }} />
              <ListItemText primary={sales.foodName} secondary={`Total Sales: ${sales.totalSales}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
