import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar2.css';
import { assets } from '../../assets/frontend_assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import DropdownNotif from '../DropdownNotif/DropdownNotif';

const Navbar2 = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const [user, setUser] = useState({});
    const { getTotalCartAmount, token, setToken, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${url}/api/user/user`, {
                headers: { token } 
            });

            if (response.data.success) {
                setUser(response.data.user);
            } else {
                console.log('Error fetching user');
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const logout = async () => {
        try {
            // Send request to backend to clear the cookie
            await axios.post(`${url}/api/auth/logout`, {}, { withCredentials: true });
    
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
        if (token) {
            fetchUser();
        }
    }, [token]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar2">
            <Link to="/">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/en/8/8c/Cebu_Institute_of_Technology_University_logo.png"
                    alt="CIT-U Logo" 
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
                <img src={assets.search_icon} alt="Search Icon" />
                <div className="nav2-notif-con">
                    <Link to="/" >
                        <DropdownNotif />
                    </Link>
                </div>
                <div className="navbar2-search-icon">
                    <Link to="/cart">
                        <img src={assets.basket_icon} alt="Cart Icon" />
                    </Link>
                    <div className={getTotalCartAmount() === 0 ? '' : 'dot'}></div>
                </div>
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                ) : (
                    <div className="navbar2-profile" ref={dropdownRef}>
                        <img 
                            src={assets.profile_icon} 
                            alt="Profile Icon" 
                            onClick={() => {
                                setIsDropdownOpen(!isDropdownOpen);
                            }} 
                        />
                        <ul className={`nav2-profile-dropdown ${isDropdownOpen ? 'open' : ''}`}>
                            <div className="nav-profile-header">
                                <img className="profile-img" src={assets.profile_icon} alt="User Profile" />
                                <p>{user.name}</p>
                            </div>
                            <li onClick={() => navigate('/profile')}>
                                <img src='https://i0.wp.com/thelegalquotient.com/wp-content/uploads/2023/04/Person.jpg?w=225&ssl=1' alt="Profile" />
                                <p>My Profile</p>
                            </li>
                            <li onClick={() => navigate('/myReservations')}>
                                <img src={assets.bag_icon} alt="Reservations" />
                                <p>Reservations</p>
                            </li>
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="Logout" />
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
