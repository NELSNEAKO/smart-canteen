import React, { useState, useEffect } from 'react';
import './TotalRevenue.css';
import axios from 'axios';

const TotalRevenue = ({url}) => {
    const [totalRevenue, setTotalRevenue] = useState({ daily: 0, weekly: 0, monthly: 0 });

    const fetchTotalRevenue = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/total-amounts`);
            
            if (response.data.success) {
                setTotalRevenue(response.data.data);  // Now correctly mapping daily, weekly, monthly
                // console.log("Fetched revenue:", response.data.data);
            } else {
                console.error("Error fetching revenue:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching total revenue:", error);
        }
    };

    useEffect(() => {
        fetchTotalRevenue();
    }, []);

    return (
        <div className='totalRevenue-container'>
            <h2>💰 Total Revenue</h2>
            <div className="revenue-table">
                <div className="revenue-table-format title">
                    <b>Daily</b>
                    <b>Weekly</b>
                    <b>Monthly</b>
                </div>
            </div>
            <div className="revenue-table">
                <div className="revenue-table-format">
                    <p>₱{totalRevenue.dailyRevenue}</p>
                    <p>₱{totalRevenue.monthlyRevenue}</p>
                    <p>₱{totalRevenue.weeklyRevenue}</p>
                </div>
            </div>
        </div>
    );
};

export default TotalRevenue;
