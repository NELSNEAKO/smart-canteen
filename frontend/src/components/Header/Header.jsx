import React from 'react'
import './Header.css'

function Header() {
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Reserve your favourite food here</h2>
            <p>
              Treat yourself to a freshly prepared meal, made just for you. Place your order
              in advance and enjoy a delightful dining experience.  
            </p>
            <button>View Menu</button>
        </div>
    </div>
  )
}

export default Header