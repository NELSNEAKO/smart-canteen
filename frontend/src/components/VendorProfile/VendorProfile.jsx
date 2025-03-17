import React, { useEffect, useState, useContext } from "react";
import "./VendorProfile.css"; 
import axios from "axios";
import { StoreContext } from '../../context/StoreContext';
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from 'react-router-dom';



const VendorProfile = () => {

    const navigate = useNavigate();

    const [vendor, setVendor] = useState([]);
    const { url } = useContext(StoreContext);

    
    const fetchVendorData = async () => {
        try {
            const response = await axios.get(`${url}/api/vendor/data`, {
                withCredentials: true, // Ensure cookies are sent with the request
            });
    
            if (response.data.success) {
                setVendor(response.data.vendorData);
                // console.log(response.data.vendorData);
            } else {
                console.log('Error: Vendor data not fetched correctly');
            }
        } catch (err) {
            console.error('Error during fetch:', err);
        }
    };
    

      const handleSendOtp = async () => {
        try {
           
            const response = await axios.post(`${url}/api/auth/send-verify-otp`, {},{ withCredentials: true });
            setTimeout(() => navigate("/vendor/verify-email"), 100);
            console.log('sending OTP EMAIL');
        } catch (error) {
          console.log('error sending OTP');
          
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
          <p className="detail-item-detais">{vendor.email}</p>
        </div>
        <div className="verify-btn">
            {vendor.isAccountVerified 
                ? <div className="verified"> <img src={assets.verified} alt="" /> <p>Verified</p> </div>
                : <button onClick={()=> handleSendOtp()}>Verify account</button>
            }
        </div>  
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span>Name</span>
          <span className="detail-item-detais">{vendor.name}</span>
        </div>
        <div className="detail-item">
          <span>Email account</span>
          <span className="detail-item-detais">{vendor.email}</span>
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

export default VendorProfile;