import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedUserType }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType"); // Assuming you store this after login

  if (!token || userType !== allowedUserType) {
    return <Navigate to="/" replace />; // Redirect unauthorized users
  }
  if (userType !== allowedUserType) {
    return userType === "vendor" ? <Navigate to="/vendor/add" replace /> : <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
