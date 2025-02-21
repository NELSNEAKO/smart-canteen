import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Reservation from './pages/Reservation/Reservation';
import Login from './pages/Login/Login';
import UpdatePopup from './components/UpdatePopup/UpdatePopup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = 'http://localhost:5000';
  const [showUpdate, setShowUpdate] = useState(false);

  return (
    <div>
      {showUpdate && <UpdatePopup setShowUpdate={setShowUpdate} />}
      <ToastContainer />

      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes (Dashboard Layout) */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <div className="app-content-wrapper">
                <Sidebar setShowUpdate={setShowUpdate} />
                <div className="app-content">
                  <Routes>
                    <Route path="/add" element={<Add url={url} />} />
                    <Route path="/list" element={<List url={url} />} />
                    <Route path="/reservation" element={<Reservation url={url} />} />
                  </Routes>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
