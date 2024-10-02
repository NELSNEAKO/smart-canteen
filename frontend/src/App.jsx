import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VendorPage from './pages/VendorPage';
import StudentPage from './pages/StudentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterVendorPage from './pages/RegisterVendorPage';  // Vendor registration page
import ProfilePage from './pages/ProfilePage';  // Vendor/Student profile page
import SettingsPage from './pages/SettingsPage';  // Settings page for password updates etc.
import TrackActivityPage from './pages/TrackActivityPage';  // Track vendor activities
//import TrackTestVendor from './pages/TrackTestVendor';  // Track Test vendor activities
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />  {/* Default route: Login page */}
          <Route path="/home" element={<HomePage />} />  {/* Home Page route */}
          <Route path="/vendor" element={<VendorPage />} />  {/* Vendor Dashboard route */}
          <Route path="/student" element={<StudentPage />} />  {/* Student Dashboard route */}
          <Route path="/login" element={<LoginPage />} />  {/* Login page route */}
          <Route path="/register" element={<RegisterPage />} />  {/* Student registration route */}
          <Route path="/register-vendor" element={<RegisterVendorPage />} />  {/* Vendor registration route */}
          <Route path="/profile" element={<ProfilePage />} />  {/* Profile page route */}
          <Route path="/settings" element={<SettingsPage />} />  {/* Settings page route */}
          <Route path="/track-activity" element={<TrackActivityPage />} />  {/* Vendor Track Activity route */}
          {/* <Route path="/track-activityVendor" element={<TrackTestVendor />} />  Vendor Track Activity route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;