import React, { useEffect, useState } from 'react';
import { 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button, 
    Menu,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

export default function VendorTrack() {
    const [reservations, setReservations] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch reservation details for vendors
    const fetchReservations = () => {
        setLoading(true); // Start loading
        axios.get('http://localhost:5000/api/get-Reservation')
            .then(response => {
                setReservations(response.data);
                setLoading(false); // Stop loading
            })
            .catch(error => {
                console.error('Error fetching reservations:', error);
                alert('Failed to fetch reservations. Please try again later.');
                setLoading(false); // Stop loading
            });
    };

    useEffect(() => {
        fetchReservations();
    }, []);  

    const handlePendingOpen = (event, index) => {
        setAnchorEl(event.currentTarget);
        setCurrentIndex(index);
    };
    
    const handlePendingClose = () => {
        setAnchorEl(null);
        setCurrentIndex(null);
    };

    const handleStatusChange = async (index, newStatus) => {
        const reservation = reservations[index]; // Get the current reservation
        const formData = new FormData();
        formData.append('status', newStatus);

        try {
            await axios.put(`http://localhost:5000/api/update-reservation/${reservation.id}`, 
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            // Update the reservations state to reflect the new status
            setReservations(prevReservations => 
                prevReservations.map((res, i) => 
                    i === index ? { ...res, status: newStatus } : res
                )
            );
        } catch (error) {
            console.error('Error updating status:', error.response || error);
            alert('Failed to update reservation status. Please try again.');
        }
    };
    
    if (loading) {
        return <CircularProgress />; // Show a loading spinner
    }
   // console.log('Updating reservation with ID:', reservations);
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Track Reservation Order Details
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Food Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Student ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.length > 0 ? reservations.map((reservation, index) => (
                            <TableRow key={reservation.id}> {/* Use unique id as key */}
                                <TableCell>{reservation.foodName}</TableCell>
                                <TableCell>{reservation.quantity}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="text" 
                                        color="inherit" 
                                        onClick={(event) => handlePendingOpen(event, index)} 
                                        sx={{ fontWeight: 'light' }}
                                    >
                                        {reservation.status}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && currentIndex === index}
                                        onClose={handlePendingClose}
                                    >
                                        <MenuItem onClick={() => handleStatusChange(index, 'Pending')}>Pending</MenuItem>
                                        <MenuItem onClick={() => handleStatusChange(index, 'Completed')}>Completed</MenuItem>
                                    </Menu>
                                </TableCell>
                                <TableCell>{reservation.studentId}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                    No reservations found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
