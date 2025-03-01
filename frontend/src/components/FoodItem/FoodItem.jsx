import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image, category }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    return (
        <div className="food-item">
            <div className="food-item-left">
                <img
                    className="food-item-image"
                    src={image ? url + "/images/" + image : assets.food_placeholder}
                    alt={name}
                />
                    <p className="food-item-name">{name}</p>
            </div>

            <div className="food-item-right">
                <div className="food-item-info">
                    <p className="food-item-calories">{category}</p>
                    <p className="food-item-desc">{description}</p>
                    <p className="food-item-sec">₱{price}</p>
                    <img className="food-item-rating" src={assets.rating_starts} alt="rating" />
                </div>
                {!cartItems[id] ? (
                    <img
                        className="add-button"
                        onClick={() => addToCart(id)}
                        src={assets.add_icon_white}
                        alt="Add"
                    />
                ) : (
                    <div className="food-item-counter">
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodItem;
