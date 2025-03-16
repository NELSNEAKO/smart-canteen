import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EmailVerify.css";
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';




const EmailVerify = () => {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { url } = useContext(StoreContext);


  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please fill fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/auth/verify-account`, {
        otp
      }, { withCredentials: true});

      if (response.data.success) {
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/"), 100);

      } else {
        toast.error(response.data.message || "Verification failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="verify-container">
      <div className="verify-header">
        <h2>Email Verification</h2>
      </div>
      <form className="verify-form" onSubmit={handleVerify}>
        
        <div className="detail-item-verify">
          <span>OTP Code</span>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <div className="btn-section-verify">
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerify;
