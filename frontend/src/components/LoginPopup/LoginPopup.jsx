import React, { useState, useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    student_id: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
    // console.log('Updated Data:', data);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    let newUrl = url; // url = http://localhost:5000
    if (currState === 'Login') {
      newUrl += '/api/user/login';
    } else {
      newUrl += '/api/user/register';
    }
    console.log('Constructed URL:', newUrl); // Log the final URL

    try {
      const response = await axios.post(newUrl, data);
      console.log('API Response:', response);

      if (response.data.success) {
        if (currState === 'Login') {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          setShowLogin(false);
        } else {
          alert(response.data.message || 'Registration successful.');
        }
      } else {
        alert('Error: ' + response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred while processing your request. Please try again.');
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="login-popup-inputs">
          {currState === 'Login' ? null : (
            <>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Your name"
                required
              />
              <input
                name="student_id"
                onChange={onChangeHandler}
                value={data.student_id}
                type="text"
                placeholder="Student Id"
                required
              />
            </>
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <button type="submit">{currState === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        {currState === 'Sign Up' ? (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        ) : null}
        {currState === 'Login' ? (
          <p>
            Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
