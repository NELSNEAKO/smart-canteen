import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentLayout from "./layouts/StudentLayout";
import VendorLayout from "./layouts/VendorLayout";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import protected route

// Student Pages
import HomePage from "./pages/Student/Home/HomePage";
import Cart from "./pages/Student/Cart/Cart";
import PlaceOrder from "./pages/Student/PlaceOrder/PlaceOrder";
import Verify from "./pages/Student/Verify/Verify";
import MyReservations from "./pages/Student/MyReservations/MyReservations";

// Vendor Pages
import Add from "./pages/Vendor/Add/Add";
import List from "./pages/Vendor/List/List";
import Reservation from "./pages/Vendor/Reservation/Reservation";
import Login from "./pages/Vendor/Login/Login";

const App = () => {

  return (
    <Router>
      <Routes>
        {/* Vendor Routes */}
        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<Login />} />
          <Route element={<ProtectedRoute allowedUserType="vendor" />}>
            <Route path="add" element={<Add />} />
            <Route path="list" element={<List />} />
            <Route path="reservation" element={<Reservation url={url} />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<ProtectedRoute allowedUserType="student" />}>
            <Route path="cart" element={<Cart />} />
            <Route path="order" element={<PlaceOrder />} />
            <Route path="verify" element={<Verify />} />
            <Route path="myReservations" element={<MyReservations />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
