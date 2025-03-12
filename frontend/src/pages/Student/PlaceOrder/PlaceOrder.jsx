import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import './PlaceOrder.css';

function PlaceOrder() {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Define totalAmount and reservationFee here so they can be used everywhere
  const totalAmount = getTotalCartAmount(); 
  const reservationFee = totalAmount * 0.5; 

  const placeOrder = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const userId = token;
    console.log("User ID from Token:", userId);
    
    if (!userId) {
      setError('User authentication failed. Please log in again.');
      return;
    }

    let items = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        id: item._id,
        price: item.price,
        name: item.name,
        quantity: cartItems[item._id],
      }));

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    let reservationData = {
      amount: totalAmount, // ✅ Send full amount to backend
      items,
    };

    try {
      console.log("Sending Reservation Data:", reservationData);
      let response = await axios.post(`${url}/api/reservation/place`, reservationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.session_url) {
        window.location.href = response.data.session_url; // ✅ Redirect to PayMongo
      } else {
        setError('Failed to create checkout session.');
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.response?.data?.message || 'An error occurred while placing the order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate('/cart');
    else if (getTotalCartAmount() === 0) navigate('/cart');
  }, [token, navigate]);

  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Reservation Information</p>
      </div>
      <div className="place-order-right">
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <hr />
              {/* ✅ Show full price and reservation fee separately */}
              <div className="cart-total-details">
                <b>Total (Full Price)</b>
                <b>₱{totalAmount}</b>
              </div>
              <div className="cart-total-details">
                <b>Reservation Fee (50%)</b>
                <b>₱{reservationFee.toFixed(2)}</b>
              </div>
            </div>
            <button type='submit' disabled={loading}>
              {loading ? 'Processing...' : 'PROCEED TO PAYMENT'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
