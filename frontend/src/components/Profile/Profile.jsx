import React, { useEffect, useState, useContext } from "react";
import "./Profile.css"; 
import axios from "axios";
import { StoreContext } from '../../context/StoreContext';
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from 'react-router-dom';



const Profile = () => {

    const navigate = useNavigate();

    const [student, setStudent] = useState([]);
    const { url } = useContext(StoreContext);

    
    const fetchStudentData = async () => {
        try {
          const response = await axios.get(`${url}/api/user/data`, {
            withCredentials: true, // Send cookies for authentication
          });
  
          if (response.data.success) {
            setStudent(response.data.studentData);
            // console.log(response.data.studentData);
          } else {
            console.log('error fetching student data');
          }
        } catch (err) {
          console.error(err);
        } 
      };

      const handleSendOtp = async () => {
        try {
           
            const response = await axios.post(`${url}/api/auth/send-verify-otp`, {},{ withCredentials: true });
            setTimeout(() => navigate("/verify-email"), 100);
            console.log('sending OTP EMAIL');
        } catch (error) {
          console.log('error sending OTP');
          
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
          <p className="detail-item-detais">{student.email}</p>
        </div>
        <div className="verify-btn">
            {student.isAccountVerified 
                ? <div className="verified"> <img src={assets.verified} alt="" /> <p>Verified</p> </div>
                : <button onClick={()=> handleSendOtp()}>Verify account</button>
            }
        </div>  
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span>Name</span>
          <span className="detail-item-detais">{student.name}</span>
        </div>
        <div className="detail-item">
          <span>Student Id</span>
          <span className="detail-item-detais">{student.studentId}</span>
        </div>
        <div className="detail-item">
          <span>Email account</span>
          <span className="detail-item-detais">{student.email}</span>
        </div>
        <div className="detail-item">
          <span>Password</span>
          <span className="detail-item-detais">*********</span>
        </div>
        
      </div>
      <div className="btn-section">
        <button className="save-btn">Save Change</button>
        <button className="edit-btn">Edit</button>
      </div>
    </div>
  );
};

export default Profile;