import React, { useState, useEffect } from 'react';
import './UpdatePopup.css';
import axios from 'axios';
import { assets } from '../../assets/admin_assets/assets';

function UpdatePopup({ user, setShowUpdate, url, fetchUser }) {
    const [data, setData] = useState({
        name: '',
        student_id: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                student_id: user.student_id,
                email: user.email,
                password: ''
            });
        }
    }, [user]);

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onUpdate = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.put(`${url}/api/user/update/${user.id}`, data);
            if (response.data.success) {
                alert(response.data.message || 'User updated successfully.');
                fetchUser();
                setShowUpdate(false);
            } else {
                alert('Error: ' + response.data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.log('Error occurred:', error);
            alert('An error occurred while processing your request. Please try again.');
        }
    };

    return (
        <div className='update-popup'>
            <form onSubmit={onUpdate} className='update-popup-container'>
                <div className='update-popup-title'>
                    <h2>Update</h2>
                    <img onClick={()=>setShowUpdate(false)} src={assets.cross_icon} alt="close" />
                </div>
                <div className='update-popup-inputs'>
                <input 
                    type='text' 
                    name='student_id' 
                    placeholder='Student ID' 
                    value={data.student_id} 
                    onChange={onChangeHandler} 
                />
                <input 
                    type='text' 
                    name='name' 
                    placeholder='Name' 
                    value={data.name} 
                    onChange={onChangeHandler} 
                />
                <input 
                    type='email' 
                    name='email' 
                    placeholder='Email' 
                    value={data.email} 
                    onChange={onChangeHandler} 
                />
                <input 
                    type='password' 
                    name='password' 
                    placeholder='Password' 
                    value={data.password} 
                    onChange={onChangeHandler} 
                />
                </div>
                <button type='submit' className='update-popup-button'>Update</button>
            </form>    
        </div>
    );
}

export default UpdatePopup;