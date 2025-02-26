import React, { useEffect, useState } from 'react';
import './Reservation.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../../assets/admin_assets/assets'
import { useNavigate } from 'react-router-dom';


const Reservation = ({ url }) => {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem('token'); // Get token from local storage
  const navigate = useNavigate();



  const fetchAllReservations = async () => {
    if (!token) {
      toast.error("Unauthorized: No token provided");
      navigate('/'); // ✅ Redirect after login
      return;
    }
    try {
      const response = await axios.get(`${url}/api/payment/vendor-list`);
      if (response.data.success) {
        setReservations(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error('Error fetching reservations');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    }
  };

  const statusHandler = async (event, paymentId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(`${url}/api/payment/status`, {
        paymentId: paymentId,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success('Status Updated Successfully');
        fetchAllReservations(); // Refresh data after update
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Something went wrong!');
    }
  };

  useEffect(() => {
    fetchAllReservations();
  }, []);

  return (
    <div className="reservation add">
      <h3>Reservation Page</h3>
      <div className="reservation-list">
        {reservations.map((reservation, index) => (
          <div key={index} className="reservation-item">
            <img src={assets.parcel_icon} alt="Reservation Icon" />
            <div>
              {/* Display Food Items */}
              <p className="reservation-item-food">
                {reservation.ReservationItems?.map((item, idx) =>
                  idx === reservation.ReservationItems.length - 1
                    ? `${item.FoodItem?.name} x ${item.quantity}`
                    : `${item.FoodItem?.name} x ${item.quantity}, `
                )}
              </p>
              {/* Display Student ID and Name */}
              <p className="reservation-item-name">
                {reservation.User?.student_id} - {reservation.User?.name} <br />
                {reservation.User?.email}
              </p>
            </div>

            {/* Display Order Length */}
            <p><b>Items:</b> {reservation.ReservationItems?.length || 0}</p>

            {/* Display Total Amount */}
            <p>
              ₱
              {Math.round(
                (reservation.ReservationItems && Array.isArray(reservation.ReservationItems))
                  ? reservation.ReservationItems.reduce(
                      (total, item) => total + (item.Payment?.amount || 0),
                      0
                    )
                  : 0
              )}
            </p>

            {/* Status Dropdown - Looping through ReservationItems */}
            {reservation.ReservationItems?.map((item, index) => (
              item.Payment && (
                <div key={index}>
                  <select
                    onChange={(event) => statusHandler(event, item.Payment.id)}
                    value={item.Payment.status}
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Payment Failed</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                  </select>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservation;
