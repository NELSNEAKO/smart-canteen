 import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddFoodItem from '../components/VendorManagement/AddFoodItem';
import UpdateFoodItem from '../components/VendorManagement/UpdateFoodItem';
import DeleteFoodItem from '../components/VendorManagement/DeleteFoodItem';
import AccountMenu from '../components/profile/AccountMenu';  // Corrected import path

function VendorPage() {
  const navigate = useNavigate();
  const [openUpdate, setOpenUpdate] = useState(false); // State for opening the update dialog
  const [openDelete, setOpenDelete] = useState(false); // State for opening the delete dialog
  const [foodItems, setFoodItems] = useState([]); // State to store food items

  // Fetch food items when the component is mounted
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food-items');
        setFoodItems(response.data);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchFoodItems();
  }, []);

  // Functions to handle opening and closing of the update dialog
  const handleOpenUpdate = () => setOpenUpdate(true); 
  const handleCloseUpdate = () => setOpenUpdate(false);

  // Functions to handle opening and closing of the delete dialog
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <Container maxWidth="md" style={{ marginTop: '50px', position: 'relative' }}>
      <Typography variant="h4" gutterBottom>
        Vendor Management Dashboard
      </Typography>
      
      {/* Account Menu */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <AccountMenu />
      </div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Add New Food Item
            </Typography>
            <AddFoodItem />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Button to trigger the Update Food Item modal */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleOpenUpdate}
            style={{ padding: '15px 0', fontSize: '18px' }}
          >
            Update Existing Food Item
          </Button>

          {/* Dialog for Update Food Item */}
          <Dialog open={openUpdate} onClose={handleCloseUpdate} maxWidth="sm" fullWidth>
            <DialogTitle>Update Food Item</DialogTitle>
            <DialogContent>
              <UpdateFoodItem />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUpdate} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Button to trigger the Delete Food Item modal */}
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleOpenDelete}
            style={{ padding: '15px 0', fontSize: '18px' }}
          >
            Delete Existing Food Item
          </Button>

          {/* Dialog for Delete Food Item */}
          <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="sm" fullWidth>
            <DialogTitle>Delete Food Item</DialogTitle>
            <DialogContent>
              <DeleteFoodItem />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      {/* Display Food Items Table */}
      <Typography variant="h5" style={{ marginTop: '30px' }}>
        Your Food Items
      </Typography>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Food ID</TableCell>
              <TableCell>Food Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No food items available
                </TableCell>
              </TableRow>
            ) : (
              foodItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>₱{item.price}</TableCell>
                  <TableCell>
                    {item.image ? (
                      <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} style={{ width: '50px' }} />
                    ) : (
                      'No image'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default VendorPage;