import React, { useEffect, useState, useContext } from "react";
import "./Profile.css"; 
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const [student, setStudent] = useState({});
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Student Data
  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${url}/api/user/data`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setStudent(response.data.studentData);
        setUpdatedStudent(response.data.studentData);
      } else {
        console.log("Error fetching student data");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Update Student Data
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${url}/api/auth/update`, updatedStudent, {
        withCredentials: true,
      });

      if (response.data.success) {
        setStudent(updatedStudent);
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
      await axios.post(`${url}/api/auth/send-verify-otp`, {}, { withCredentials: true });
      setTimeout(() => navigate("/verify-email"), 100);
      console.log("Sending OTP EMAIL");
    } catch (error) {
      console.log("Error sending OTP");
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h2>{student.name}</h2>
          <p className="detail-item-details">{student.email}</p>
        </div>
        <div className="verify-btn">
          {student.isAccountVerified ? (
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
            <input type="text" name="name" value={updatedStudent.name || ""} onChange={handleChange} />
          ) : (
            <span className="detail-item-details">{student.name}</span>
          )}
        </div>
        <div className="detail-item">
          <span>Student ID</span>
          {isEditing ? (
          <input type="text" name="studentId" value={updatedStudent.studentId || ""} onChange={handleChange} />
        ) : (
          <span className="detail-item-details">{student.studentId}</span>
        )}
        </div>
        <div className="detail-item">
          <span>Email</span>
          {isEditing ? (
            <input type="email" name="email" value={updatedStudent.email || ""} onChange={handleChange} />
          ) : (
            <span className="detail-item-details">{student.email}</span>
          )}
        </div>
        <div className="detail-item">
          <span>Password</span>
          {isEditing ? (
            <input type="password" name="password" value={updatedStudent.password || ""} onChange={handleChange} />
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
