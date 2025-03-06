import React, { useState, useEffect } from "react";
import "./TotalReservations.css";
import axios from "axios";

const TotalReservations = ({url}) => {
  const [totalReservations, setTotalReservations] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });

  useEffect(() => {
    const fetchTotalReservations = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/total-reservations`);
        if (response.data.success) {
          setTotalReservations(response.data.data);
          // console.log("Fetched reservations:", response.data.data);
        } else {
          console.error("Error fetching reservations:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching total reservations:", error);
      }
    };

    fetchTotalReservations();
  }, []);

  return (
    <div className="totalReservations-container">
      <h2>📅 Total Reservations</h2>
      <div className="reservations-table">
        <div className="reservations-table-format title">
          <b>Daily</b>
          <b>Weekly</b>
          <b>Monthly</b>
        </div>
      </div>
      <div className="reservations-table">
        <div className="reservations-table-format">
          <p>{totalReservations.dailyReservations}</p>
          <p>{totalReservations.weeklyReservations}</p>
          <p>{totalReservations.monthlyReservations}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalReservations;
