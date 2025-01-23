import React from 'react'
import './Footer.css'
import { assets } from '../../assets/frontend_assets/assets'
import {Link} from 'react-router-dom'

function Footer() {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
          <div className="footer-content-left">
              <Link to='/'><img src='https://upload.wikimedia.org/wikipedia/en/8/8c/Cebu_Institute_of_Technology_University_logo.png' alt="cit-u logo" className="logo" /></Link>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, numquam! Optio aliquam 
                ex laboriosam natus corrupti nisi, distinctio laborum enim accusamus! Cum fugiat, ad excepturi commodi architecto repellat ipsam natus.
                </p>
                <div className="footer-social-icons">
                  <img src={assets.facebook_icon} alt="" />
                  <img src={assets.twitter_icon} alt="" />
                  <img src={assets.linkedin_icon} alt="" />
                </div>
          </div>
          <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                  <li>Home</li>
                  <li>About us</li>
                  <li>Delivery</li>
                  <li>Privacy policy</li>
                </ul>
          </div>
          <div className="footer-content-right">
              <h2>GET IN TOUCH</h2>
              <ul>
                <li>+1-231-445-8910</li>
                <li>janjo@gmail.com</li>
              </ul>
          </div>
        </div>
        <hr />
        <p className="footer-copyright">Copyright © 2024 CIT-U. All rights reserved.</p>
    </div>
  )
}

export default Footer