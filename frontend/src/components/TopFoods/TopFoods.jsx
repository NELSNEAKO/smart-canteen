import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './TopFoods.css';

const TopFoods = () => {
    const { url, topList } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);


    return (
        <>
            {/* Toggle Button (Arrow) */}
            <button className="toggle-btn" onClick={() => setIsOpen(true)}>
                ➤
            </button>

            {/* Sidebar Container */}
            <div className={`top-foods-container ${isOpen ? 'open' : ''}`}>
                {/* Close Button */}
                <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>

                <h2>Top Food Items</h2>
                <div className="top-foods-grid">
                    {topList.map((food, index) => (
                        <div key={food.FoodItem?.id || index} className="food-card"> {/* Fixed key issue */}
                            <img 
                                src={food.FoodItem?.image ? `${url}/images/${food.FoodItem.image}` : ''} 
                                alt="food" 
                                className="food-image" 
                            />
                            <div className="food-info">
                                <span className="rank">#{index + 1}</span>
                                <h3 className="food-name">{food.FoodItem?.name || "Unknown"}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TopFoods;
