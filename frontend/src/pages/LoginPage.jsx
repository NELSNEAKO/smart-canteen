import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false); // For the pop-up dialog
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); // Store the token
        navigate('/home'); // Redirect after successful login
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while logging in');
    }
  };

  // Open the register dialog
  const handleOpenDialog = () => {
    setOpen(true);
  };

  // Close the register dialog
  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Handle vendor registration option
  const handleVendorRegister = () => {
    navigate('/register-vendor'); // Redirect to vendor registration page
  };

  // Handle student registration option
  const handleStudentRegister = () => {
    navigate('/register'); // Redirect to student registration page
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
        <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
          Don't have an account? <span onClick={handleOpenDialog} style={{ cursor: 'pointer', color: 'blue' }}>Register</span>
        </Typography>
      </Paper>

      {/* Pop-up Dialog for Vendor or Student Registration */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Select Registration Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you registering as a Vendor or a Student?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVendorRegister} color="primary">
            Register as Vendor
          </Button>
          <Button onClick={handleStudentRegister} color="secondary">
            Register as Student
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default LoginPage;