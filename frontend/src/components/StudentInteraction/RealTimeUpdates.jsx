import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function RealTimeUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food-updates');
        setUpdates(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch updates.');
        setLoading(false);
      }
    };

    fetchUpdates();
    const intervalId = setInterval(fetchUpdates, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Real-Time Updates
      </Typography>
      {updates.length === 0 ? (
        <Typography>No updates available.</Typography>
      ) : (
        <List>
          {updates.map((update) => (
            <ListItem key={update.id} divider>
              <ListItemText primary={update.message} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default RealTimeUpdates;