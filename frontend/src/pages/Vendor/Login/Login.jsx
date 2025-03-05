import './Login.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import Spinner from '../../../components/Spinner/Spinner';

const Login = () => {
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);
  const [loading, setLoading] = useState(false); // Loading state
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
    setLoading(true); // Start loading
    let newUrl = url + (currState === 'Login' ? '/api/vendor/login' : '/api/vendor/register');

    try {
      const response = await axios.post(newUrl, data, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data.success) {
        if (currState === 'Login' && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userType', response.data.userType);
          alert('Login successful!');
          navigate(response.data.userType === 'vendor' ? '/vendor/add' : '/');
        }else {
          alert(response.data.message || 'Vendor Registration successful.');
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/vendor/add');
    }
  }, []);

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