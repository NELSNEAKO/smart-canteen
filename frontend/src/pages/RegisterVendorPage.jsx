import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';

const RegisterVendorPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const vendorCode = 'forvendoronly38'

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (secretCode !== vendorCode) {  // Check for correct secret code
      setError('Invalid secret code for vendor registration');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', { // API call for registration
        username,
        email,
        password,
        role: 'vendor'  // Role for vendor registration
      });

      if (response.status === 201) {
        setSuccess('Vendor registered successfully');
        setTimeout(() => {
          navigate('/login');  // Redirect to login after successful registration
        }, 1500);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Register as Vendor
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 2 }}>
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
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Secret Code"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register as Vendor
          </Button>
        </Box>
        <Button onClick={() => navigate('/')} variant="outlined" fullWidth sx={{ mt: 2 }}>
          Back
        </Button>
      </Paper>
    </Container>
  );
};

export default RegisterVendorPage;