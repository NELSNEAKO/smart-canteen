import React, { useState } from "react";
import { ToastContainer } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Styles
import Navbar2 from "../components/Navbar2/Navbar2";
import Footer from "../components/Footer/Footer";
import LoginPopup from "../components/LoginPopup/LoginPopup";
import { Outlet } from "react-router-dom";
import '../App.css';

const StudentLayout = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Added ToastContainer */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <Navbar2 setShowLogin={setShowLogin} />
      <div className="app">
        <div className="container">
          <Outlet /> {/* Renders student routes */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentLayout;
