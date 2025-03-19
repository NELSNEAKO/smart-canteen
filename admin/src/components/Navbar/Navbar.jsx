
import React, { useState, useEffect,  } from 'react';
import './Navbar.css';
import { assets } from '../../assets/admin_assets/assets';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import VendorNotif from '../VendorNotif/VendorNotif';


const Navbar = ({url}) => {
  const navigate = useNavigate();

    const [admin, setadmin] = useState([]);

    
    const fetchadminData = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/data`, {
                withCredentials: true, // Ensure cookies are sent with the request
            });
            
            if (response.data.success) {
                setadmin(response.data.adminData);
                // console.log(response.data.adminData);
            } else {
                console.log('Error: admin data not fetched correctly');
            }
        } catch (err) {
            console.error('Error during fetch:', err);
        }
    };


    const logout = async () => {
      try {
          // Send request to backend to clear the cookie
          await axios.post(`${url}/api/admin/logout`, {}, { withCredentials: true });
  
          // Remove localStorage data
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
  
          // Redirect user to home/login page
          navigate('/login');
      } catch (error) {
          console.log('Error logging out:', error.response?.data?.message || error.message);
      }
  };

  useEffect(() => {
    fetchadminData();
}, []);

  

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img onClick={()=> navigate('/')}
          className="logo"
          src="https://upload.wikimedia.org/wikipedia/en/8/8c/Cebu_Institute_of_Technology_University_logo.png"
          alt="Logo"
        />
        <p className="details">admin Panel</p>
      </div>
      <div className="navbar-right">
        <VendorNotif url={url}/>
        <div className="navbar-profile">
          <img src={assets.profile_icon} alt="Profile" />
          <ul className="nav-profile-dropdown">
            <div className="profile-header">
              <img className="profile-img" src={assets.profile_icon} alt="User" />
              <p className="profile-name">{admin.name}</p>
            </div>  
            <li onClick={ ()=> navigate('/profile')}>
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
