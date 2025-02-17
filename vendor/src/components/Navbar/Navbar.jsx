import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/admin_assets/assets'
const Navbar = () => {
  return (
    <div className='navbar'>
      <img className='logo' src='https://upload.wikimedia.org/wikipedia/en/8/8c/Cebu_Institute_of_Technology_University_logo.png' alt="" />
      <img  className='profile' src={assets.profile_image} alt="" />
      <p className='details'>Vendor Panel</p>
    </div>
  )
}

export default Navbar
