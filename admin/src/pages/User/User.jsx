import React, { useState, useEffect } from 'react';
import './User.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import UpdatePopup from '../../components/UpdatePopup/UpdatePopup';

function User({ url }) {
    const [user, setUser] = useState([]);
    const [showUpdate, setShowUpdate] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUser = async () => {
        const response = await axios.get(`${url}/api/user/users`);
        if (response.data.success) {
            setUser(response.data.users);
        } else {
            toast.error(response.data.message);
        }
    };

    const deleteUser = async (userId) => {
        const response = await axios.delete(`${url}/api/user/delete/${userId}`);
        if (response.data.success) {
            toast.success(response.data.message);
            fetchUser();
        } else {
            toast.error(response.data.message);
        }
    };

    const handleUpdateClick = (user) => {
        setSelectedUser(user);
        setShowUpdate(true);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="users add flex-col">
            <p>All Users</p>
            <div className="user-table">
                <div className="user-table-format title">
                    <b>Student ID</b>
                    <b>Name</b>
                    <b>Email</b>
                    <b className='action-title'>Action</b>
                </div>
                {user.map((item, index) => {
                    return (
                        <div className="user-table-format" key={index}>
                            <p>{item.student_id}</p>
                            <p>{item.name}</p>
                            <p>{item.email}</p>
                            <p onClick={() => deleteUser(item.id)} className="cursor action">X</p>
                            <p onClick={() => handleUpdateClick(item)} className="cursor action">Update</p>
                        </div>
                    );
                })}
            </div>
            {showUpdate && <UpdatePopup user={selectedUser} setShowUpdate={setShowUpdate} url={url} fetchUser={fetchUser} />}
        </div>
    );
}

export default User;