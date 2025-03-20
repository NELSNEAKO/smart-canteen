import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import UpdatePopup from "../components/UpdatePopup/UpdatePopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VendorLayout = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const location = useLocation();

  // Hide sidebar for these routes
  const hideSidebarRoutes = ["/vendor/verify-email", "/vendor/profile"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <>
      {showUpdate && <UpdatePopup setShowUpdate={setShowUpdate} />}
      <ToastContainer />
      <Navbar />
      <div className="app-content-wrapper">
        {!hideSidebar && <Sidebar setShowUpdate={setShowUpdate} />} {/* Conditionally render Sidebar */}
        <div className="app-content">
          <Outlet /> {/* Renders vendor routes */}
        </div>
      </div>
    </>
  );
};

export default VendorLayout;
