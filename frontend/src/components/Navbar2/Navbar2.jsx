import React, { useContext, useState, useEffect } from 'react';
import './Navbar2.css';
import { assets } from '../../assets/frontend_assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';


const Navbar2 = ({ setShowLogin }) => {
    const url = 'http://localhost:5000'
    const [menu, setMenu] = useState('home');
    const [user, setUser] = useState([]);
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {

            const token = localStorage.getItem('token');
            // console.log(token);
            
            const response = await axios.get(`${url}/api/user/user`, {
                headers: { token } // Send the token in `headers.token`
            });
    
            if (response.data.success) {
                setUser(response.data.user); // Ensure `user` is singular if your backend returns an object
                // console.log(response.data.user)
            } else {
                console.log('error fetching');
                
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };
    

    const logout = () => {
        localStorage.removeItem('token');
        setToken("");
        navigate('/');
    };

    useEffect(() => {
        if (token) {
            fetchUser();
        }
    }, [token]); 
    

    return (
        <div className="navbar2">
            <Link to="/">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/en/8/8c/Cebu_Institute_of_Technology_University_logo.png"
                    alt="cit-u logo" 
                    className="logo"
                />
            </Link>
            <ul className="navbar2-menu">
                <Link to="/" onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>Home</Link>
                <a href="#explore-menu" onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>Menu</a>
                <a href="#app-download" onClick={() => setMenu('mobile-app')} className={menu === 'mobile-app' ? 'active' : ''}>Mobile App</a>
                <a href="#footer" onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>Contact Us</a>
            </ul>
            <div className="navbar2-right">
                <img src={assets.search_icon} alt="Search" />
                <div className="navbar2-search-icon">
                    <Link to="/cart">
                        <img src={assets.basket_icon} alt="Cart" />
                    </Link>
                    <div className={getTotalCartAmount() === 0 ? '' : 'dot'}></div>
                </div>
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                ) : (
                    <div className="navbar2-profile">
                        <img src={assets.profile_icon} alt="Profile" />
                        <ul className="nav2-profile-dropdown">
                            <div className="profile-header">
                                <img className="profile-img" src={assets.profile_icon} alt="User" />
                                <p>{user.name}</p>
                            </div>
                            <hr />
                            <li onClick={() => navigate('/myReservations')}>
                                <img src={assets} alt="" />
                                <p>Edit Profile</p>
                            </li>
                            <li onClick={() => navigate('/myReservations')}>
                                <img src={assets.bag_icon} alt="" />
                                <p>Reservations</p>
                            </li>
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="" />
                                <p>Logout</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar2;
