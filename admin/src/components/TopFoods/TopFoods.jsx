import React, { useState, useEffect } from 'react';
import './TopFoods.css';
import axios from 'axios';

const TopFoods = () => {
    const url = 'http://localhost:5000';
    const [topList, setTopList] = useState([]);

    const fetchTopList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/top`);
            setTopList(response.data.data || []);
            console.log("Top list:", response.data.data);
        } catch (error) {
            console.error("Error fetching top foods:", error);
        }
    };

    useEffect(() => {
        fetchTopList();
    }, []);

    return (
        <div className="top-foods-container">
            <h2>🔥 Top Food Items</h2>
            <div className="top-foods-grid">
                {topList.map((food, index) => (
                    <div key={food.id || index} className="food-card">  {/* ✅ FIXED KEY */}
                        <img 
                            src={food.FoodItem?.image ? `${url}/images/${food.FoodItem.image}` : ''} 
                            alt="food" 
                            className="food-image" 
                        />
                        <div className="food-info">
                            <span className="rank">#{index + 1}</span>
                            <h3 className="food-name">{food.FoodItem?.name || "Unknown Food"}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopFoods;
