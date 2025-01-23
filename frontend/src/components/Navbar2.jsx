import React, { useContext, useState } from 'react'
import './Navbar2.css'
import { assets } from '../assets/frontend_assets/assets'
import {Link} from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'

const Navbar2 = ({setShowLogin}) => {

    const [menu, setMenu] = useState('home');

    const {getTotalCartAmount} = useContext(StoreContext);

  return (
    <div className='navbar'>
        <Link to='/'><img src='https://upload.wikimedia.org/wikipedia/en/8/8c/Cebu_Institute_of_Technology_University_logo.png' alt="cit-u logo" className="logo" /></Link>
        <ul className="navbar-menu">
            <Link to='/'onClick={()=>setMenu('home')} className={menu === 'home'?'active':''}>home</Link>
            <a href='#explore-menu' onClick={()=>setMenu('menu')} className={menu === 'menu'?'active':''}>menu</a>
            <a href='#app-download' onClick={()=>setMenu('mobile-app')} className={menu === 'mobile-app'?'active':''}>mobile-app</a>
            <a href='#footer' onClick={()=>setMenu('contact-us')} className={menu === 'contact-us'?'active':''}>contact us</a>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
            <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                <div className={getTotalCartAmount()===0?'':'dot'}></div>
            </div>
                <button onClick={()=>setShowLogin(true)}>sign in</button>
        </div>
    </div>
  )
}

export default Navbar2