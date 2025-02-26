import './Login.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const url = 'http://localhost:5000';
  const navigate = useNavigate();

  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    invite_code: '',
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    let newUrl = url + (currState === 'Login' ? '/api/vendor/login' : '/api/vendor/register');

    try {
      const response = await axios.post(newUrl, data, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data.success) {
        if (currState === 'Login' && response.data.token) {
          localStorage.setItem('token', response.data.token);
          alert('Login successful!');
          navigate('/main'); // ✅ Redirect after login
        } else {
          alert(response.data.message || 'Registration successful.');
        }
      } else {
        alert('Error: ' + (response.data.message || 'Something went wrong.'));
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred while processing your request. Please try again.');
    }
  };

    // ✅ Auto-redirect if token exists
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/vendor/add'); // Redirect to main page if token is found
      }
    }, []);

  return (
    <div className='login'>
      <form onSubmit={onLogin} className='login-container'>
        <div className='login-title'>
          <h2>{currState}</h2>
        </div>
        <div className='login-inputs'>
          {currState === 'Login' ? null : (
            <>
              <input
                name='name'
                onChange={onChangeHandler}
                value={data.name}
                type='text'
                placeholder='Your name'
                required
              />
              <input
                name='invite_code'
                onChange={onChangeHandler}
                value={data.invite_code}
                type='text'
                placeholder='Invite code'
                required
              />
            </>
          )}
          <input
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            type='text'
            placeholder='Your email'
            required
          />
          <input
            name='password'
            onChange={onChangeHandler}
            value={data.password}
            type='password'
            placeholder='Your password'
            required
          />
        </div>
        <button type='submit'>{currState === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        {currState === 'Sign Up' ? (
          <div className='login-condition'>
            <input type='checkbox' required />
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

export default Login;
  