import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './TopFoods.css';

const TopFoods = () => {
    const { url, topList } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                Top Foods
            </button>

            <div className={`top-foods-container ${isOpen ? 'open' : ''}`}>
                <h2>Top Food Items</h2>
                <div className="top-foods-grid">
                    {topList.map((food, index) => (
                        <div key={food.id} className="food-card">
                            <img 
                                src={food.FoodItem.image ? `${url}/images/${food.FoodItem.image}` : ''} 
                                alt="food" 
                                className="food-image" 
                            />
                            <div className="food-info">
                                <span className="rank">#{index + 1}</span>
                                <h3 className="food-name">{food.FoodItem.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TopFoods;
