import React, { useState } from "react";
import Navbar2 from "../components/Navbar2/Navbar2";
import Footer from "../components/Footer/Footer";
import LoginPopup from "../components/LoginPopup/LoginPopup";
import { Outlet } from "react-router-dom";
import '../App.css';

const StudentLayout = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <Navbar2 setShowLogin={setShowLogin} />
      <div className="app">
        <Outlet /> {/* Renders student routes */}
      </div>
      <Footer />
    </>
  );
};

export default StudentLayout;
