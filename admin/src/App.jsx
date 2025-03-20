import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import User from './pages/User/User';
import Reservation from './pages/Reservation/Reservation';
import AdminPanel from './pages/AdminDashboard/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import UpdatePopup from './components/UpdatePopup/UpdatePopup';
import Login from './pages/Login/Login';
import Profile from './components/Profile/Profile';
import ResetPassword from './components/ResetPassword/ResetPassword'
import ResetPasswordForm from './components/ResetPasswordForm/ResetPasswordForm'
import EmailVerify from './components/EmailVerify/EmailVerify';

const App = () => {
  const url = "https://smart-canteen-backend.onrender.com";
  // const url = 'http://localhost:5000';

  const [showUpdate, setShowUpdate] = useState(false);
  const location = useLocation();
  
  // Hide sidebar on /login and /profile, but only hide navbar on /login
  const hideSidebar = ["/", "/profile"].includes(location.pathname);
  const hideNavbar = location.pathname === "/";

  return (
    <div>
      {showUpdate && <UpdatePopup setShowUpdate={setShowUpdate} />}
      <ToastContainer />

      {/* Only hide navbar on /login */}
      {!hideNavbar && <Navbar url={url} />}

      <Routes>
        {/* Login page (completely standalone, centered) */}
        <Route path="/" element={<Login url={url} />} />

        {/* Profile page (navbar visible, sidebar hidden) */}
        <Route path="/profile" element={<Profile url={url} />} />

        <Route path="send-reset-otp" element={<ResetPassword url={url}/>} />

        <Route path="reset-password" element={<ResetPasswordForm url={url} />} />

        <Route path="verify-email" element={<EmailVerify url={url} />} />

        {/* Other pages (navbar and sidebar both visible) */}
        <Route 
          path="/*" 
          element={
            <div className="app-content-wrapper">
              {!hideSidebar && <Sidebar setShowUpdate={setShowUpdate} />}
              <div className="app-content">
                <Routes>
                  <Route path="/add" element={<Add url={url} />} />
                  <Route path="/list" element={<List url={url} />} />
                  <Route path="/user" element={<User url={url} />} />
                  <Route path="/reservation" element={<Reservation url={url} />} />
                  <Route path="/analytics" element={<AdminPanel url={url} />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
