import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar2 from './components/Navbar2';
import './App.css';

import HomePage from './pages/Home/HomePage';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Verify from './pages/Verify/Verify';
import MyReservations from './pages/MyReservations/MyReservations';

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
        <Route path="/verify" element={<Verify />} /> {/* Verify Page route */}
        <Route path="/myReservations" element={<MyReservations />} /> {/* Reservation Page route */}


      </Routes>
      </div>
      <Footer />
    </Router>
  );
}


export default App;