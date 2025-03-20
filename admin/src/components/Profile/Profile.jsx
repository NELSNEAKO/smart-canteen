import React, { useEffect, useState } from "react";
import "./Profile.css"; 
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";

const Profile = ({ url }) => {
  const navigate = useNavigate();
  
  const [admin, setAdmin] = useState({});
  const [updatedAdmin, setUpdatedAdmin] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Admin Data
  const fetchAdminData = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/data`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setAdmin(response.data.adminData);
        setUpdatedAdmin(response.data.adminData);
      } else {
        console.log("Error fetching admin data");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAdmin((prev) => ({ ...prev, [name]: value }));
  };

  // Update Admin Data
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${url}/api/admin/update`, updatedAdmin, {
        withCredentials: true,
      });

      if (response.data.success) {
        setAdmin(updatedAdmin);
        setIsEditing(false);
      } else {
        console.log("Error updating profile");
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
      await axios.post(`${url}/api/admin/send-verify-otp`, {}, { withCredentials: true });
      setTimeout(() => navigate("/verify-email"), 100);
      console.log("Sending OTP EMAIL");
    } catch (error) {
      console.log("Error sending OTP");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-head">
          <h2>{admin.name}</h2>
          <p className="detail-item-details">{admin.email}</p>
        </div>
        <div className="verify-btn">
          {admin.isAccountVerified ? (
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
            <input type="text" name="name" value={updatedAdmin.name || ""} onChange={handleChange} />
          ) : (
            <span className="detail-item-details">{admin.name}</span>
          )}
        </div>
        <div className="detail-item">
          <span>Email</span>
          {isEditing ? (
            <input type="email" name="email" value={updatedAdmin.email || ""} onChange={handleChange} />
          ) : (
            <span className="detail-item-details">{admin.email}</span>
          )}
        </div>
        <div className="detail-item">
          <span>Password</span>
          {isEditing ? (
            <input type="password" name="password" value={updatedAdmin.password || ""} onChange={handleChange} />
          ) : (
            <span className="detail-item-details">*********</span>
          )}
        </div>
      </div>

      <div className="btn-section">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save Change"}
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

export default Profile;
