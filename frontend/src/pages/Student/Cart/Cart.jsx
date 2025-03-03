import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
    const navigate = useNavigate();
    // console.log("Cart Items in Cart:", cartItems);

    return (
        <div className='cart'>
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
                {food_list.map((item, index) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={index}>
                                <div className="cart-items-title cart-items-item">
                                    <img src={url+"/images/"+item.image} alt={item.name} />
                                    <p>{item.name}</p>
                                    <p>₱{item.price}</p>
                                    <p>{cartItems[item._id]}</p> {/* Quantity of product */}
                                    <p>₱{item.price * cartItems[item._id]}</p> {/* Total amount */}
                                    <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>₱{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()}</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>
            </div>
        </div>
    );
}

export default Cart;