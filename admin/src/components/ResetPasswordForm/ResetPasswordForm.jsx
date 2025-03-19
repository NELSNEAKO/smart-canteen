import React, { useState, useContext } from "react";
import axios from "axios";
import "./ResetPasswordForm.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/auth/reset-password`, {
        email,
        otp,
        newPassword
      });

      if (response.data.success) {
        setMessage("Password reset successfully. You can now login.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Reset Password</h2>
        <p>Enter your email, OTP, and a new password to reset your account.</p>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form className= 'reset-form' onSubmit={handleSubmit}>
          <label>Email <span className="required">*</span></label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <label>OTP <span className="required">*</span></label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={loading}
          />

          <label>New Password <span className="required">*</span></label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="reset-links">
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
