import React, { useState, useEffect } from 'react';
import AccountMenu from '../components/profile/AccountMenu';  // Corrected import path
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container,
   TextField,
    Button,
    Typography,
    Paper, Box,
    Alert,
    Avatar,
    Dialog,
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle
   } from '@mui/material';

function ProfilePage() {  
  const navigate = useNavigate();
  const [users, setUsers] = useState(false); // State for opening the update dialog
  const [loading, setLoading] = useState(false); // State for opening the delete dialog
  const [error, setError] = useState([]); // State to store food items

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-user');
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ position: 'relative', right: 220 }}>
        <AccountMenu />
      </div>
        <Avatar
          alt="User Name"
          src="https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg" // Replace with a user image URL
          sx={{ width: 150, height: 150, margin: '0 auto' }}
        />
        {users.map((user) =>(
          <Typography variant="h4" gutterBottom>
            {user.id}
          </Typography>
        )
        )}
        
        <Typography variant="body1" color="textSecondary" gutterBottom>
          email@example.com
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Location: City, Country
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">
            Bio: This is a short bio about the user. It can include interests, hobbies, or any other relevant information.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Edit Profile
        </Button>
      </Paper>
    </Container>
  );
}
export default ProfilePage;