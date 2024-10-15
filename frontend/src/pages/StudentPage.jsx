import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Container, 
  Typography, 
  Grid, 
  Paper, 
  Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ViewAvailableFood from '../components/StudentInteraction/ViewAvailableFood';
import AccountMenu from '../components/profile/AccountMenu';  // Corrected import path
import OrderedList from '../components/StudentInteraction/OrderedList';
import TopSales from '../components/StudentInteraction/TopSales';

function StudentPage() {
  const [userRole, setUserRole] = useState('');
  const [studentId, setStudentId] = useState(''); // Store the studentId input from registration
  const [reservations, setReservations] = useState([]);  // For vendor reservations
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
      setStudentId(decodedToken.student_id); // Assuming student_id is in the token
    }

    // fetchFoodItems();
  }, []);

  //console.log('student Id',studentId);
  return (
    <Container maxWidth="md" style={{ marginTop: '50px', position: 'relative' }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      
      {/* Account Menu */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <AccountMenu />
      </div>
     <Grid container spacing={4}>
        <Grid item xs={12} md ={5}>
          <Paper elevation={5} style={{ padding: '20px' }} sx={{ maxHeight: 600, overflow: 'auto' }} Set max height and enable scrolling>
            <Typography variant="h5" align='center'>
              Available Food Items  
            </Typography>
            <ViewAvailableFood />
          </Paper>
        </Grid>
        <Grid item xs={12} md ={7}>
          <Paper elevation={5} style={{ padding: '20px' }} >
            <Typography variant="h5" gutterBottom>
              Your Ordered Items 
            </Typography>
            <OrderedList studentId={studentId}/>
          </Paper>
        </Grid>
        <Grid item xs={12} md ={5}>
          <Paper elevation={5} style={{ padding: '20px' }} >
            <Typography variant="h5" gutterBottom>
            Top 5 Selling Food Items 
            </Typography>
            <TopSales />
          </Paper>
        </Grid>
      </Grid>

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
}

export default StudentPage;

