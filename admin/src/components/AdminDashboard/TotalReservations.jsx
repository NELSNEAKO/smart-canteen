import React, { useState, useEffect } from 'react';
import './TotalReservations.css';
import axios from 'axios';


const TotalReservations = () => {
  const url = "http://localhost:5000";
  const [orders, setOrders] = useState({ daily: 0, weekly: 0, monthly: 0 });

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/total-reservations`);
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
        
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching total reservations:", error);
    }
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <><div className="total-reservation-container">
      <h2>Total Reservations</h2>
      <div className="total-reservations">
        <div className="total-reservation">
          <h3>Daily</h3>
          <p>{orders.daily}</p>
        </div>
        <div className="total-reservation">
          <h3>Weekly</h3>
          <p>{orders.weekly}</p>
        </div>
        <div className="total-reservation">
          <h3>Monthly</h3>
          <p>{orders.monthly}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default TotalReservations;