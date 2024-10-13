
import React, { useState } from 'react';
import { IconButton, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function CustomDeleteIcon({ reservationId, onDelete }) { // Only passing reservationId
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleDelete = async () => {
        //console.log('Delete button clicked'); // Add this line to check if the function is called
        if (!reservationId) {
            setError('Reservation ID is required.');
            return;
        }
    
        try {
            //console.log('Deleting reservation with ID:', reservationId);
            await axios.delete(`http://localhost:5000/api/delete-Reservation/${reservationId}`);
            setSuccess('Reservation deleted successfully!');
            setError('');
            if (onDelete) {
                onDelete(reservationId); // Call the callback to refresh the list
            }
        } catch (err) {
            console.error('Error during deletion:', err.response ? err.response.data : err.message);
            setError('Failed to delete reservation.');
            setSuccess('');
        }
    };
    

    return (
        <>
            <IconButton
                color='text'
                onClick={handleDelete}
                sx={{
                    '&:hover': {
                        backgroundColor: 'lightgray',
                    },
                    fontSize: 50,
                }}
            >
                <DeleteIcon />
            </IconButton>
            <Snackbar
                open={Boolean(success)}
                message={success}
                autoHideDuration={6000}
                onClose={() => setSuccess('')}
            />
            <Snackbar
                open={Boolean(error)}
                message={error}
                autoHideDuration={6000}
                onClose={() => setError('')}
            />
        </>
    );
}

export default CustomDeleteIcon;

