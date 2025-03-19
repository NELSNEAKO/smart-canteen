import React, { useContext, useEffect, useState } from 'react';
import './RecentFood.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'; // Import axios for API calls

const RecentFood = () => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
    const [recentFoods, setRecentFoods] = useState([]); // State to store food items

    // Fetch recent food items from backend

    const fetchRecentFoods = async () => {
        try {
            const response = await axios.get(`${url}/api/food/recent-food`); // Adjust the endpoint as needed
            if (response.data.success) {
                setRecentFoods(response.data.data); // Store food data in state
                console.log(response.data.data);
                
            }
        } catch (error) {
            console.error("Error fetching recent foods:", error);
        }
    };

    useEffect(() => {
        fetchRecentFoods();
    }, []);

    return (
        <div className="food-fisplay" id='food-display'> 
            <div className="food-display-list">
                    {recentFoods.length > 0 ? (
                    <div>
                        <h1>Recent Food</h1>
                        {recentFoods.map((food) => (
                            <div className="food-item" key={food._id}>
                                <div className="food-item-left">
                                    <img
                                        className="food-item-image"
                                        src={food.image ? `${url}/images/${food.image}` : assets.food_placeholder}
                                        alt={food.name}
                                    />
                                    <p className="food-item-name">{food.name}</p>
                                </div>

                                <div className="food-item-right">
                                    <div className="food-item-info">
                                        <p className="food-item-calories">{food.category}</p>
                                        <p className="food-item-desc">{food.description}</p>
                                        <p className="food-item-sec">₱{food.price}</p>
                                        <img className="food-item-rating" src={assets.rating_starts} alt="rating" />
                                    </div>
                                    {!cartItems[food._id] ? (
                                        <img
                                            className="add-button"
                                            onClick={() => addToCart(food._id)}
                                            src={assets.add_icon_white}
                                            alt="Add"
                                        />
                                    ) : (
                                        <div className="food-item-counter">
                                            <img onClick={() => removeFromCart(food._id)} src={assets.remove_icon_red} alt="Remove" />
                                            <p>{cartItems[food._id]}</p>
                                            <img onClick={() => addToCart(food._id)} src={assets.add_icon_green} alt="Add" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No recent food items available.</p>
                )}
            </div>
        </div>
    );
};

export default RecentFood;
