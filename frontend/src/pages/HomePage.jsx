import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Use named import

function HomePage() {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // Decode JWT token to get the user role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login'); // Redirect to login if token is invalid
      }
    } else {
      navigate('/login'); // Redirect to login if no token is present
    }
  }, [navigate]);

  return (
    <Container maxWidth="md" style={{ marginTop: '100px', textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Smart Canteen Management System
      </Typography>
      <Typography variant="h6" gutterBottom>
        Streamlining canteen operations for vendors and students.
      </Typography>
      <Grid container spacing={4} justifyContent="center" style={{ marginTop: '60px' }}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/vendor"
            size="large"
            fullWidth
            style={{ padding: '15px 0', fontSize: '18px' }}
            disabled={userRole !== 'vendor'}  // Disable button for non-vendors
          >
            Vendor Portal
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to="/student"
            size="large"
            fullWidth
            style={{ padding: '15px 0', fontSize: '18px' }}
            disabled={userRole !== 'student'}  // Disable button for non-students
          >
            Student Portal
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;