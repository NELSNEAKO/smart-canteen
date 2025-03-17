import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // ✅ Import Navigate
import StudentLayout from "./layouts/StudentLayout";
import VendorLayout from "./layouts/VendorLayout";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import protected route
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Student Pages
import ResetPasswordForm from "./components/ResetPasswordForm/ResetPasswordForm";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import HomePage from "./pages/Student/Home/HomePage";
import Cart from "./pages/Student/Cart/Cart";
import PlaceOrder from "./pages/Student/PlaceOrder/PlaceOrder";
import Verify from "./pages/Student/Verify/Verify";
import MyReservations from "./pages/Student/MyReservations/MyReservations";
import EmailVerify from "./components/EmailVerify/EmailVerify";
import Profile from "./components/Profile/Profile";


// Vendor Pages
import Add from "./pages/Vendor/Add/Add";
import List from "./pages/Vendor/List/List";
import Reservation from "./pages/Vendor/Reservation/Reservation";
import Login from "./pages/Vendor/Login/Login";
import VendorResetPass from "./components/VendorResetPass/VendorResetPass";
import VendorResetPassForm from "./components/VendorResetPassForm/VendorResetPassForm";
import VendorProfile from "./components/VendorProfile/VendorProfile";
import VendorEmailVerify from "./components/VendorEmailVerify/VendorEmailVerify";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Vendor Routes */}
        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<Login />} />
          <Route path="send-reset-otp" element={<VendorResetPass />} />
          <Route path="reset-password" element={<VendorResetPassForm />} />
          <Route element={<ProtectedRoute allowedUserType="vendor" />}>
            <Route path="profile" element={<VendorProfile />} />
            <Route path="verify-email" element={<VendorEmailVerify />} />
            <Route path="add" element={<Add />} />
            <Route path="list" element={<List />} />
            <Route path="reservation" element={<Reservation />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<HomePage />} />
          <Route path="send-reset-otp" element={<ResetPassword />} />
          <Route path="reset-password" element={<ResetPasswordForm />} />
          <Route element={<ProtectedRoute allowedUserType="student" />}>
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<Profile />} />
            <Route path="verify-email" element={<EmailVerify />} />
            <Route path="order" element={<PlaceOrder />} />
            <Route path="verify" element={<Verify />} />
            <Route path="myReservations" element={<MyReservations />} />
          </Route>
        </Route>

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
