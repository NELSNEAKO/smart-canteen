import React from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ViewAvailableFood from '../components/StudentInteraction/ViewAvailableFood';
import AccountMenu from '../components/profile/AccountMenu';  // Corrected import path

function StudentPage() {
  const navigate = useNavigate();

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
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Available Food Items
            </Typography>
            <ViewAvailableFood />
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