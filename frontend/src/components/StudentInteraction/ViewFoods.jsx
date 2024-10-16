import React, { useEffect, useState } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Paper,
    Box, 
    CircularProgress, 
    Alert, 
    ListItemAvatar, 
    Avatar 
  } from '@mui/material';
import axios from 'axios';

function ViewFoods() {
  const [value, setValue] = React.useState('1');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food-items');
        //console.log('API Response:', response.data); // Log the whole response
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '40%', typography: 'body1' }}>
    <Paper elevation={3} style={{ padding: '20px', margin: '20px'}}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="BreakFast" value="1" />
            <Tab label="Lunch" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
        {foodItems.length === 0 ? (
        <Typography>No food items available.</Typography>
          ) : (
              <List>
                  {foodItems
                      .filter(item => item.availability === 'Break Fast') // Only include items with availability 'Break Fast'
                      .map(item => (
                          <ListItem key={item.id} divider>
                              {item.image && (
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
        </TabPanel>
        <TabPanel value="2">
        {foodItems.length === 0 ? (
        <Typography>No food items available.</Typography>
          ) : (
              <List>
                  {foodItems
                      .filter(item => item.availability === 'Lunch') // Only include items with availability 'Break Fast'
                      .map(item => (
                          <ListItem key={item.id} divider>
                              {item.image && (
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
        </TabPanel>
      </TabContext>
    </Paper>
    </Box>
  );
}

export default ViewFoods;