
import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import VendorTrack from '../components/VendorManagement/VendorTrack';
import AccountMenu from '../components/profile/AccountMenu';  // Corrected import path
import OrderedList from '../components/StudentInteraction/OrderedList';

const TrackActivityPage = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);  // State to hold items added to cart
  const [userRole, setUserRole] = useState('');
  const [studentId, setStudentId] = useState(''); // Store the studentId input from registration
  const [reservations, setReservations] = useState([]);  // For vendor reservations
  const [quantities, setQuantities] = useState({});  // State to track quantities for each item

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
      setStudentId(decodedToken.student_id); // Assuming student_id is in the token
    }

    fetchFoodItems();
  }, []);

  useEffect(() => {
    if (userRole === 'vendor') {
      fetchReservations();
    }
  }, [userRole]);

  // Fetch food items
  const fetchFoodItems = () => {
    axios.get('http://localhost:5000/api/food-items')
      .then(response => setFoodItems(response.data))
      .catch(error => console.error('Error fetching food items:', error));
  };

  // Fetch reservation details for vendors
  const fetchReservations = () => {
    axios.get('http://localhost:5000/api/get-Reservation')
      .then(response => setReservations(response.data))
      .catch(error => console.error('Error fetching reservations:', error));
  };

  // Handle quantity input change
  const handleQuantityChange = (foodId, value) => {
    setQuantities((prev) => ({ ...prev, [foodId]: value }));
  };

  // Function to add an item to the cart
  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1; // Default to 1 if no quantity is selected
    const cartItem = { ...item, quantity };  // Add quantity to cart item
    setCart([...cart, cartItem]);  // Add item to cart
  };

  // Function to remove item from cart
  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);  // Remove the item from the cart
    setCart(newCart);
  };

  // Function to handle checkout (Confirm Reservation)
  const handleCheckout = () => {
    const reservationData = {
      studentId,  // The logged-in student’s ID (extracted from the token)
      foodItems: cart.map(item => ({
        foodId: item.id,
        quantity: item.quantity
      }))
    };

    console.log("Reservation Data: ", reservationData); // Debug log

    // Post reservation data to the backend
    axios.post('http://localhost:5000/api/add-reservation', reservationData)
      .then(response => {
        alert('Reservation successful!');
        setCart([]);  // Clear cart on successful reservation
      })
      .catch(error => {
        console.error('Error confirming reservation:', error); // Print error for debugging
        alert('Failed to confirm reservation. Please try again.');
      });
  };
  //console.log('cart:', cart);

  return (  
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Track Activity
      </Typography>
      {/* Account Menu */}
      <div style={{ position: 'absolute', top: 20, right: 500 }}>
        <AccountMenu />
      </div>
      
      {/* Show this section only if the user is a vendor */}
      {userRole === 'vendor' && <VendorTrack />}

      {/* This section is shown to both students and vendors */}
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Track Status of Food Items
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Food ID</TableCell>
              <TableCell>Food Name</TableCell>
              <TableCell>Status</TableCell>
              {userRole === 'student' && <TableCell>Quantity</TableCell>} {/* Quantity column for students */}
              {userRole === 'student' && <TableCell>Add to Cart</TableCell>} {/* Show Add to Cart button for students */}
            </TableRow>
          </TableHead>
          <TableBody>
            {foodItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.status}</TableCell>
                {userRole === 'student' && (
                  <TableCell>
                    {/* Quantity input field */}
                    <TextField
                      type="number"
                      value={quantities[item.id] || ''}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      inputProps={{ min: 1 }}
                      size="small"
                    />
                  </TableCell>
                )}
                {userRole === 'student' && (
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleAddToCart(item)}
                      disabled={item.status !== 'Available'}  // Disable button if item is not available
                    >
                      Add to Cart
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Display cart for students */}
      {userRole === 'student' && cart.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom style={{ marginTop: '30px' }}>
            Your Cart
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Food Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>₱{item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₱{item.price * item.quantity}</TableCell>  {/* Total price calculation */}
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => handleRemoveFromCart(index)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
            
          {/* Checkout section */}
          <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
            Checkout
          </Typography>
          <Typography variant="body1" gutterBottom>
            Payment Method: <strong>Pay at the Counter with Exact Amount</strong>
          </Typography>
          <Button 
            variant="contained" 
            color="success" 
            fullWidth
            style={{ marginTop: '10px' }}
            onClick={handleCheckout}  // Call the handleCheckout function on click
          >
            Confirm Reservation
          </Button>
        </>
      )}
      {userRole === 'student' && <OrderedList studentId={studentId}/>}
      {/* Back Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(-1)}
        style={{ marginTop: '20px' }}
      >
        Back
      </Button>
    </Container> 
  );
};

export default TrackActivityPage;
