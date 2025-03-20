import React, { useEffect, useState, useContext } from "react";
import "./VendorProfile.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";

const VendorProfile = () => {
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const [vendor, setVendor] = useState({});
  const [updatedVendor, setUpdatedVendor] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Vendor Data
  const fetchVendorData = async () => {
    try {
      const response = await axios.get(`${url}/api/vendor/data`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setVendor(response.data.vendorData);
        setUpdatedVendor(response.data.vendorData);
      } else {
        console.log("Error fetching vendor data");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedVendor((prev) => ({ ...prev, [name]: value }));
  };

  // Update Vendor Data
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${url}/api/vendor/update`, updatedVendor, {
        withCredentials: true,
      });

      if (response.data.success) {
        setVendor(updatedVendor);
        setIsEditing(false);
        alert("Vendor updated successfully!");
      } else {
        console.log("Error updating vendor");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for verification
  const handleSendOtp = async () => {
    try {
      await axios.post(`${url}/api/vendor-auth/send-verify-otp`, {}, { withCredentials: true });
      setTimeout(() => navigate("/vendor/verify-email"), 1000);
      console.log("Sending OTP EMAIL");
    } catch (error) {
      console.log("Error sending OTP");
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h2>{vendor.name}</h2>
          <p className="detail-item-details">{vendor.email}</p>
        </div>
        <div className="verify-btn">
          {vendor.isAccountVerified ? (
            <div className="verified">
              <img src={assets.verified} alt="" />
              <p>Verified</p>
            </div>
          ) : (
            <button onClick={handleSendOtp}>Verify account</button>
          )}
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span>Name</span>
          {isEditing ? (
            <input type="text" name="name" value={updatedVendor.name || ""} onChange={handleChange} />
          ) : (
            <span className="detail-item-details">{vendor.name}</span>
          )}
        </div>
        <div className="detail-item">
          <span>Email</span>
          {isEditing ? (
            <input type="email" name="email" value={updatedVendor.email || ""} onChange={handleChange} />
          ) : (
            <span className="detail-item-details">{vendor.email}</span>
          )}
        </div>
        <div className="detail-item">
          <span>Password</span>
          {isEditing ? (
            <input type="password" name="password" value={updatedVendor.password || ""} onChange={handleChange} />
          ) : (
            <span className="detail-item-details">*********</span>
          )}
        </div>
      </div>

      <div className="btn-section">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button className="edit-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default VendorProfile;