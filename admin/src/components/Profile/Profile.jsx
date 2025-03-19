import React, { useEffect, useState, useContext } from "react";
import "./Profile.css"; 
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from 'react-router-dom';



const Profile = ({url}) => {

    const navigate = useNavigate();

    const [admin, setadmin] = useState([]);

    
    const fetchadminData = async () => {
        try {
          const response = await axios.get(`${url}/api/admin/data`, {
            withCredentials: true, // Send cookies for authentication
          });
  
          if (response.data.success) {
            setadmin(response.data.adminData);
            // console.log(response.data.adminData);
          } else {
            console.log('error fetching admin data');
          }
        } catch (err) {
          console.error(err);
        } 
      };

      const handleSendOtp = async () => {
        try {
           
            const response = await axios.post(`${url}/api/admin/send-verify-otp`, {},{ withCredentials: true });
            setTimeout(() => navigate("/verify-email"), 100);
            console.log('sending OTP EMAIL');
        } catch (error) {
          console.log('error sending OTP');
          
        }
    };

    useEffect(() => {
        fetchadminData();
    }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-head">
          <h2>{admin.name}</h2>
          <p className="detail-item-detais">{admin.email}</p>
        </div>
        <div className="verify-btn">
            {admin.isAccountVerified 
                ? <div className="verified"> <img src={assets.verified} alt="" /> <p>Verified</p> </div>
                : <button onClick={()=> handleSendOtp()}>Verify account</button>
            }
        </div>  
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span>Name</span>
          <span className="detail-item-detais">{admin.name}</span>
        </div>
        <div className="detail-item">
          <span>Email account</span>
          <span className="detail-item-detais">{admin.email}</span>
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