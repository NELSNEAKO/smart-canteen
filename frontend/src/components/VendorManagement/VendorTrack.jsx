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
import Stack from '@mui/material/Stack';    
import CustomDeleteIcon from './CustomDeleteIcon';
import axios from 'axios';

export default function VendorTrack() {
    const [reservations, setReservations] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        fetchReservations();
    }, []);  

    const handleDelete = async () => {
        // Fetch reservations again after a deletion
        await fetchReservations();
    };

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

    const handleStatusChange = async (index, newStatus) => {
        const reservation = reservations[index]; // Get the current reservation
        
        try {
            await axios.put(
                `http://localhost:5000/api/update-reservation/${reservation.id}`, 
                { status: newStatus },  // Send status as JSON
                { headers: { 'Content-Type': 'application/json' } }  // Set correct content type
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

    

    const handlePendingOpen = (event, index) => {
        setAnchorEl(event.currentTarget);
        setCurrentIndex(index);
    };
    
    const handlePendingClose = () => {
        setAnchorEl(null);
        setCurrentIndex(null);
    };

    // console.log('Reservation:', reservations); // Log the entire reservation object

    if (loading) {
        return <CircularProgress />; // Show a loading spinner
    }
   // console.log('Updating reservation with ID:', reservations);
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Track Reservation Order Details
            </Typography>
            <TableContainer 
                component={Paper}
                sx={{ maxHeight: 400, overflow: 'auto' }} Set max height and enable scrolling
            >
                <Table stickyHeader aria-label="sticky table">
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
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={{ xs: 1, sm: 2, md: 4 }}
                                    >
                                        <Button 
                                            variant="contained" 
                                            color={reservation.status === 'Pending' ? 'warning' : 'success'} // Change color based on status 
                                            disabled={reservation.status === 'Completed'} // Disable button if status is 'Completed'
                                            onClick={(event) => handlePendingOpen(event, index)} 
                                            sx={{ fontWeight: 'bold', width: '50%' }} // Adjusts button to full width
                                        >   
                                            {reservation.status}
                                        </Button>
                                        {/* if status is equal to completed display DeleteButton AND pass the reservationId to Delete the reservation*/}
                                        {reservation.status === 'Completed' ?<CustomDeleteIcon reservationId={reservation.id} onDelete={handleDelete} /> : null } 
                                    </Stack>

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
