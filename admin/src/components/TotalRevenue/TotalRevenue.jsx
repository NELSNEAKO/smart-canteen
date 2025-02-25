import React, { useState, useEffect } from 'react';
import './TotalRevenue.css';
import axios from 'axios';

const TotalRevenue = () => {
    const url = "http://localhost:5000";
    const [totalRevenue, setTotalRevenue] = useState({ daily: 0, weekly: 0, monthly: 0 });

    const fetchTotalRevenue = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/total-amounts`);
            setTotalRevenue(response.data.data);
            console.log("Fetched revenue:", response.data.data);
        } catch (error) {
            console.error("Error fetching total revenue:", error);
        }
    };

    useEffect(() => {
        fetchTotalRevenue();
    }, []);

    return (
        <div className='totalRevenue-container'>
            <h2>💰Total Revenue</h2>
            <div className="revenue-table">
                <div className="revenue-table-format title">
                    <b>Daily</b>
                    <b>Weekly</b>
                    <b>Monthly</b>
                </div>
            </div>
            <div className="revenue-table">
                <div className="revenue-table-format">
                    <p>₱{totalRevenue.daily.toFixed(2)}</p>
                    <p>₱{totalRevenue.weekly.toFixed(2)}</p>
                    <p>₱{totalRevenue.monthly.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default TotalRevenue;
