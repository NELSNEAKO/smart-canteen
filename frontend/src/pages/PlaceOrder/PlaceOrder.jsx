import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

function PlaceOrder() {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeOrder = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    let reservationItems = [];
    food_list.forEach((item) => {
      if (cartItems[item.id] > 0) {
        let itemInfo = { 
          id: item.id,
          price: item.price,
          description: item.description,
          quantity: cartItems[item.id] 
        };
        reservationItems.push(itemInfo);
      }
    });

    let reservationData = {
      userId: token.userId, // Assuming you have userId in the token
      amount: getTotalCartAmount(),
      reservationItems: reservationItems
    };

    try {
      let response = await axios.post(`${url}/api/payment/placePayment`, reservationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.checkoutUrl) {
        // Redirect to the checkout page provided by PayMongo
        window.location.href = response.data.checkoutUrl;
      } else {
        setError('Failed to create checkout session.');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'An error occurred while placing the order.');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Reservation Information</p>
        <div className="multifields"></div>
      </div>
      <div className="place-order-right">
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