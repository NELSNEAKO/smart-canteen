import React, { useState } from "react";
import Navbar from '../components/Navbar/Navbar';
import Sidebar from "../components/Sidebar/Sidebar";
import UpdatePopup from "../components/UpdatePopup/UpdatePopup";
import Login from "../pages/Vendor/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";

const VendorLayout = () => {
  const [showUpdate, setShowUpdate] = useState(false);

  return (
    <>
      {showUpdate && <UpdatePopup setShowUpdate={setShowUpdate} />}
      <ToastContainer />
      <Navbar />
      <div className="app-content-wrapper">
        <Sidebar setShowUpdate={setShowUpdate} />
        <div className="app-content">
          <Outlet /> {/* Renders vendor routes */}
        </div>
      </div>
    </>
  );
};

export default VendorLayout;
