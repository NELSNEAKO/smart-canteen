import React, { useEffect, useState } from 'react';
import { 
    Typography,
    Stack, 
    Button, 
    Menu,
    MenuItem,
    CircularProgress,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';   
import axios from 'axios';

function UpdateFoodAvailability() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [foodItems, setFoodItems] = useState([]);
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

    const handleSetChange = async (index, newAvailability) => {
        const foodItem = foodItems[index]; // Get the current food item
        
        // console.log("Updating Food Item:", foodItem);
        // console.log("New Availability:", newAvailability);
    
        try {
            const response = await axios.put(
                `http://localhost:5000/api/update-availability/${foodItem.id}`, 
                { availability: newAvailability },  // Send status as JSON
                { headers: { 'Content-Type': 'application/json' } }  // Set correct content type
            );
            // console.log("Update Response:", response.data); // Log the response data
            
            // Update the foodItems state to reflect the new status
            setFoodItems(prevFoodItems => 
                prevFoodItems.map((item, i) => 
                    i === index ? { ...item, availability: newAvailability } : item
                )
            );
        } catch (error) {
            console.error('Error updating availability:', error.response?.data || error.message);
            alert('Failed to update food availability. Please try again.');
        }
    };
    

    const handlePendingOpen = (event, index) => {
        setAnchorEl(event.currentTarget);
        setCurrentIndex(index);
    };
    
    const handlePendingClose = () => {
        setAnchorEl(null);
        setCurrentIndex(null);
    };

    if (loading) {
        return <CircularProgress />; // Show a loading spinner
    }

    if (error) {
        return <Typography color="error">{error}</Typography>; // Display error message
    }
    //console.log('foodItems:', foodItems);
    return (
        <Box sx={{ paddingTop: 3 }}>
            <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
                <Typography variant="h5" style={{ marginTop: '30px', textAlign: 'center' }}>
                    Your Food Items
                </Typography>

                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Food ID</TableCell>
                                <TableCell>Food Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Set Food</TableCell>
                                <TableCell>Image</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {foodItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No food items available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                foodItems.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>₱{item.price}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant='text'
                                                onClick={(event) => handlePendingOpen(event, index)} // Pass the current index
                                                color='inherit'
                                                style={{ textTransform: 'capitalize' }}
                                            >
                                                {item.availability} {/* Show current availability */}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {item.image ? (
                                                <img src={item.imageUrl} alt={item.name} style={{ width: '50px' }} />
                                            ) : (
                                                'No image'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handlePendingClose}
            >
                <MenuItem onClick={() => handleSetChange(currentIndex, 'Break Fast')}>Break Fast</MenuItem>
                <MenuItem onClick={() => handleSetChange(currentIndex, 'Lunch')}>Lunch</MenuItem>
            </Menu>
        </Box>
    );
}

export default UpdateFoodAvailability;
