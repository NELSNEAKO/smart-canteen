import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './TopFoods.css';

const TopFoods = () => {
    const [list, setList] = useState([]);
    const { url } = useContext(StoreContext);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/top`);
            if (response.data.success) {
                setList(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching list:", error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="top-foods-container">
            <h2>Top Food Items</h2>
            <div className="top-foods-grid">
                {list.map((food, index) => (
                    <div key={food.id} className="food-card">
                        <span className="rank">{index + 1}</span>
                        <img src={food.image || '/placeholder.jpg'} alt={food.name} className="food-image" />
                        <h3 className="food-name">{food.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopFoods;
