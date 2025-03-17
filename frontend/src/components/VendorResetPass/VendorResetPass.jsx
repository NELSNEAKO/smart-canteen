import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const VendorResetPass = () => {
  const { url } = useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/vendor-auth/send-reset-otp`, { email });

      if (response.data.success) {
        setMessage("OTP sent to your email. Please check your inbox.");
        setTimeout(() => navigate("/vendor/reset-password"), 1000);
      } else {
        setError(response.data.message || "Failed to send OTP. Please try again.");
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
        <h2>Password Reset</h2>
        <p>Provide the email address associated with your account to recover your password.</p>

        {/* {message && <p className="success">{message}</p>} */}
        {error && <p className="error">{error}</p>}

        <form className="reset-form" onSubmit={handleSubmit}>
          <label>Email <span className="required">*</span></label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <div className="reset-links">
          <a href="/vendor">Login</a>
          <a href="/vendor">Register</a>
        </div>
      </div>
    </div>
  );
};

export default VendorResetPass;
