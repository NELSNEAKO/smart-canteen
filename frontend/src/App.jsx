import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Navbar2 from './components/Navbar2';
import './App.css';

import HomePage from './pages/Home/HomePage';
import RolePage from './pages/RolePage';
import VendorPage from './pages/VendorPage';
import StudentPage from './pages/StudentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterVendorPage from './pages/RegisterVendorPage';  // Vendor registration page
import ProfilePage from './pages/ProfilePage';  // Vendor/Student profile page
import SettingsPage from './pages/SettingsPage';  // Settings page for password updates etc.
import TrackActivityPage from './pages/TrackActivityPage';  // Track vendor activities
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';

function App() {

  const [showLogin,setShowLogin] = useState(false)

  return (
    <Router>
      {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className="app">
        <Navbar2 setShowLogin={setShowLogin} />
        <Routes>
        <Route path="/" element={<HomePage />} /> {/* Default route: Login page */}
        <Route path="/cart" element={<Cart />} /> {/* Cart Page route */}
        <Route path="/order" element={<PlaceOrder />} /> {/* Place Order Page route */}
        <Route path="/role" element={<RolePage />} /> {/* Home Page route */}
        <Route path="/vendor" element={<VendorPage />} /> {/* Vendor Dashboard route */}
        <Route path="/student" element={<StudentPage />} /> {/* Student Dashboard route */}
        <Route path="/login" element={<LoginPage />} /> {/* Login page route */}
        <Route path="/register" element={<RegisterPage />} /> {/* Student registration route */}
        <Route path="/register-vendor" element={<RegisterVendorPage />} /> {/* Vendor registration route */}
        <Route path="/profile" element={<ProfilePage />} /> {/* Profile page route */}
        <Route path="/settings" element={<SettingsPage />} /> {/* Settings page route */}
        <Route path="/track-activity" element={<TrackActivityPage />} /> {/* Vendor Track Activity route */}
      </Routes>
      <Footer />
      </div>
    </Router>
  );
}


export default App;