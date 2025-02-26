import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/admin_assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/vendor');
  };

  

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
        <div className="navbar-profile">
          <img className="profile" src={assets.profile_icon} alt="Profile" />
          <ul className="nav-profile-dropdown">
            <div className="profile-header">
              <img className="profile-img" src={assets.profile_icon} alt="User" />
              <p className="profile-name">John Petro</p>
            </div>
            <hr />
            <li>
              <img src={assets.edit_icon} alt="" />
              <p>Edit Profile</p>
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
