import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { assets } from '../../assets/admin_assets/assets';
import { useNavigate} from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import VendorNotif from '../VendorNotif/VendorNotif';


const Navbar = () => {
  const navigate = useNavigate();

    const [vendor, setVendor] = useState([]);
    const { url, setToken } = useContext(StoreContext);

    
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


    const logout = async () => {
      try {
          // Send request to backend to clear the cookie
          await axios.post(`${url}/api/vendor-auth/logout`, {}, { withCredentials: true });
  
          // Remove localStorage data
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
  
          // Clear frontend state if needed
          setToken("");
  
          // Redirect user to home/login page
          navigate('/');
      } catch (error) {
          console.log('Error logging out:', error.response?.data?.message || error.message);
      }
  };

  useEffect(() => {
    fetchVendorData();
}, []);

  

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img
          className="logo"
          src="https://upload.wikimedia.org/wikipedia/en/8/8c/Cebu_Institute_of_Technology_University_logo.png"
          alt="Logo"
        />
        <p className="details">Vendor Panel</p>
      </div>
      <div className="navbar-right">
        <VendorNotif />
        <div className="navbar-profile">
          <img src={assets.profile_icon} alt="Profile" />
          <ul className="nav-profile-dropdown">
            <div className="profile-header">
              <img className="profile-img" src={assets.profile_icon} alt="User" />
              <p className="profile-name">{vendor.name}</p>
            </div>  
            <li onClick={ ()=> navigate('/vendor/profile')}>
              <img src={assets.edit_icon} alt="" />
              <p>My Profile</p>
            </li>
            <li>
              <img src={assets.settings_icon} alt="" />
              <p>Settings & Privacy</p>
            </li>
            <li>
              <img src={assets.help_icon} alt="" />
              <p>Help & Support</p>
            </li>
            <li onClick={logout}>
              <img src={assets.logout_icon} alt="" />
              <p>Logout</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
