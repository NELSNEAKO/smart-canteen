import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress
} from '@mui/material';

export default function StudentReservations({ studentId }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reservations for the student
  const fetchReservations = () => {
    setLoading(true);
    setError(null);
    
    //console.log('Fetching reservations for student ID:', studentId); // Log studentId
    //console.log('studentId:',studentId )

    if (!studentId) {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/get-Reservation-Student`, {
      params: { studentId }  // Pass the studentId as a query parameter
    })
      .then(response => {
        //console.log('API Response:', response.data); // Log the response data
        setReservations(response.data.orders);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reservations:', err.message); // Log the error message
        setError('Failed to load reservations. Please try again.');
        setLoading(false);
      });
  };
  //console.log('data:', reservations);

  useEffect(() => {
    fetchReservations();
  }, [studentId]);

  // Display loading spinner while fetching data
  if (loading) {
    return <CircularProgress />;
  }

  // Display an error message if fetching fails
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Render the reservations table
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Reservation Orders for Student: {studentId}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reservation ID</TableCell>
              <TableCell>Food Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.length > 0 ? reservations.map((reservation) => (
              <TableRow key={reservation.reservationId}>
                <TableCell>{reservation.reservationId}</TableCell>
                <TableCell>{reservation.foodName}</TableCell>
                <TableCell>{reservation.quantity}</TableCell>
                <TableCell>{reservation.status}</TableCell>
                <TableCell>₱{reservation.price * reservation.quantity}</TableCell> {/* Format the price */}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                  No reservations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

