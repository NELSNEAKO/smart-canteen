import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id,name,price,description,image,status,availability}) => {

    const {cartItems,addToCart,removeFromCart,url} = useContext(StoreContext)
    // const url = "http://localhost:5000";

  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img
            className="food-item-image"
            src={image ? url + "/images/" + image : assets.food_placeholder}
            alt={name}
            />
            {!cartItems[id]
                ? <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} />
                : <div className='food-item-counter'>
                    <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                    <p>{cartItems[id]}</p>
                    <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
                </div>
            }   
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">${price}</p>
                <p className="food-item-status">{status}</p>
                <p className="food-item-availability">{availability}</p>
        </div>
    </div>
  )
}

export default FoodItem

