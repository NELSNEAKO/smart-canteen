import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container,
   TextField,
    Button,
    Typography,
    Paper, Box,
    Alert,
    Dialog,
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle
   } from '@mui/material';
import axios from 'axios';

function ProfilePage() {
  
  return (
    <header>
      <h1>My Profile</h1>
    </header>
  );
}
export default ProfilePage;