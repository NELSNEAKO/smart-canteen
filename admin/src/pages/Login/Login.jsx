import './Login.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const Login = ({url}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state
  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    secret_key: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    let newUrl = url + (currState === 'Login' ? '/api/admin/login' : '/api/admin/register');

    try {
      const response = await axios.post(newUrl, data,{
        withCredentials: true, // ✅ Include cookies
      });

      if (response.data.success) {
        if (currState === 'Login' && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userType', response.data.userType);
          toast.success('Login Successfully')
          navigate('/add');
        }else {
          toast.success(response.data.message || 'Admin Registration successful.');
        }
      } else {
        alert('Error: ' + (response.data.message || 'Something went wrong.'));
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };


  return (
    <div className='login'>
      {loading && <Spinner />} {/* Show spinner when loading */}
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
                name='secret_key'
                onChange={onChangeHandler}
                value={data.secret_key}
                type='text'
                placeholder='Secret key'
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
          {currState === 'Login' ? <p onClick={()=> navigate('/send-reset-otp')} className='forgot-pass'>Forgot password?</p> : ''}
        </div>
        <button type='submit' disabled={loading}>
          {loading ? 'Logging in...' : currState === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>
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