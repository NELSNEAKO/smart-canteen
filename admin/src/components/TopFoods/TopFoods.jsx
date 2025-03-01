import React, { useState, useEffect } from 'react';
import './TopFoods.css';
import axios from 'axios';

const TopFoods = () => {
    const url = 'https://smart-canteen-backend.onrender.com';
    const [topList, setTopList] = useState([]);

    const fetchTopList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/top`);
            setTopList(response.data.data || []);
            // console.log("Top list:", response.data.data);
        } catch (error) {
            console.error("Error fetching top foods:", error);
        }
    };

    useEffect(() => {
        fetchTopList();
    }, []);

    return (
        <div className="topFood-container">
            <h2>🔥 Top Foods</h2>
            <div className="topFood-table">
                <div className="topFood-table-format title">
                    <b>Rank</b>
                    <b>Images</b>
                    <b>Food Name</b>
                </div>
            </div>

            {topList.length > 0 ? (
                topList.map((food, index) => (
                    <div key={food.id} className="topFood-table">
                        <div className="topFood-table-format">
                            <p>#{index + 1}</p>
                            <img 
                                src={food.image ? `${url}/images/${food.image}` : ''} 
                                alt="food" 
                                className="food-image" 
                             />
                            <p>{food.name || "Unknown"}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-data">No top foods available.</p>
            )}
        </div>
    );
};

export default TopFoods;
