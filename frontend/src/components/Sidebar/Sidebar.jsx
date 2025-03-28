import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/admin_assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/vendor/add' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to='/vendor/list' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to='/vendor/reservation' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Reservations</p>
        </NavLink>
          
      </div>
    </div>
  )
}

export default Sidebar
