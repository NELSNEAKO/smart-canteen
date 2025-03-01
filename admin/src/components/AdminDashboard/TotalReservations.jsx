import React, { useState, useEffect } from 'react';
import './TotalReservations.css';
import axios from 'axios';

const TotalReservations = () => {
  const url = "http://localhost:5000";
  const [reservations, setReservations] = useState({
    total: 0,
    today: 0,
    weekly: 0,
    monthly: 0
  });

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/total-reservations`);
      setReservations(response.data);
      console.log("Fetched reservations:", response.data);
    } catch (error) {
      console.error("Error fetching total reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="totalReservations-container">
      <h2>📅 Total Reservations</h2>
      <div className="reservations-table">
        <div className="reservations-table-format title">
          <b>Time Period</b>
          <b>Reservations</b>
        </div>
      </div>

      <div className="reservations-table">
        <div className="reservations-table-format">
          <p>📅 Today</p>
          <p>{reservations.reservationsToday}</p>
        </div>
      </div>

      <div className="reservations-table">
        <div className="reservations-table-format">
          <p>📆 Weekly</p>
          <p>{reservations.reservationsThisWeek}</p>
        </div>
      </div>

      <div className="reservations-table">
        <div className="reservations-table-format">
          <p>📅 Monthly</p>
          <p>{reservations.reservationsThisMonth}</p>
        </div>
      </div>
      <div className="reservations-table">
        <div className="reservations-table-format">
          <p>📅 Total</p>
          <p>{reservations.totalReservations}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalReservations;
