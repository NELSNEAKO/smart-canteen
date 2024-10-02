import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import AccountMenu from '../components/profile/AccountMenu';  // Corrected import path

const TrackActivityPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);  // State to hold items added to cart
  const [userRole, setUserRole] = useState('');
  const [studentId, setStudentId] = useState(''); // Store the studentId input from registration
  const [reservations, setReservations] = useState([]);  // For vendor reservations
  const [quantities, setQuantities] = useState({});  // State to track quantities for each item
  const [statusReservation, setStatusReservation] = useState('');

  useEffect(() => {
    // Decode the JWT token to get the user's role and studentId
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
      setStudentId(decodedToken.student_id); // Assuming student_id is in the token
    }

    // Fetch food item statuses (accessible to both students and vendors)
    fetchFoodItems();

    // Fetch reservation details for vendors
    if (userRole === 'vendor') {
      fetchReservations();
    }
  }, [userRole]);

      //Fetch data userRole
      const fetchUserRole = () => {
        axios.get('http://localhost:5000/api/get-user')
        .then(response => {
            setUserRole(response.data);
        })
        .catch(error => console.error('Error fetching get Roles: ', error));
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

    useEffect(() => {
        if (userRole === 'vendor') {
            fetchReservations();
        }
    }, [userRole]);

  // Fetch food items
  const fetchFoodItems = () => {
    axios.get('http://localhost:5000/api/food-items')
      .then(response => {
        setFoodItems(response.data);
      })
      .catch(error => console.error('Error fetching food items:', error));
  };

  // Fetch reservation details for vendors
  const fetchReservations = () => {
    axios.get('http://localhost:5000/api/reservations')
      .then(response => {
        setReservations(response.data);
      })
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

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Track Activity
      </Typography>

      {/* Show this section only if the user is a vendor */}
      {userRole === 'vendor' && (
        <>
          <Typography variant="h6" gutterBottom>
            Track Reservation Order Details
          </Typography>
            {/* Account Menu */}
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <AccountMenu />
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Food Name</TableCell> {/* Display food name */}
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Student ID</TableCell>  {/* Display Student ID */}
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation, index) => (
                  <TableRow key={index}>
                    <TableCell>{reservation.foodName}</TableCell>  {/* Display food name */}
                    <TableCell>{reservation.quantity}</TableCell>
                    <TableCell>{reservation.status}</TableCell>
                    <TableCell>{reservation.studentId}</TableCell>  {/* Display swwtudent ID */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* This section is shown to both students and vendors */}
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Track Status of Food Items
      </Typography>
      <TableContainer component={Paper}>
        <Table>
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
                      inputProps={{ min: '' }}
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
    </Container>
  );
};

export default TrackActivityPage;
