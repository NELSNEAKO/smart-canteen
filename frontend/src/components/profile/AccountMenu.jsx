import React, { useState } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Open the menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Navigate to Profile page
  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  // Navigate to Track Activity page
  const handleTrackActivity = () => {
    navigate('/track-activity');  // Navigate to Track Activity page
    handleMenuClose();  // Close the menu after navigation
  };

  // Navigate to Settings page
  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };

  // Log out and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear the token from local storage
    navigate('/login');  // Redirect to login page
    handleMenuClose();  // Close the menu after logout
  };

  return (
    <>
      <Button variant="text" color="inherit" onClick={handleMenuOpen}sx={{ fontWeight: 'bold' }}>
        <Typography variant="h7">
        Account
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleTrackActivity}>Track Activity</MenuItem>  {/* Updated to navigate to Track Activity */}
        <MenuItem onClick={handleSettings}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;