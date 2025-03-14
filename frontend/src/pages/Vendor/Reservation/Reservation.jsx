import React, { useEffect, useState, useContext } from 'react';
import './Reservation.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../../assets/admin_assets/assets'
import { StoreContext } from '../../../context/StoreContext';



const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const { url } = useContext(StoreContext);


  const fetchAllReservations = async () => {
    try {
      const response = await axios.get(`${url}/api/reservation/list`);
      if (response.data.success) {
        setReservations(response.data.data);
        // console.log('Reservations:', response.data.data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    }
  };

  const statusHandler = async (event, reservationId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(`${url}/api/reservation/status`, {
        reservationId,
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
          {reservations.length > 0 ? (
            reservations
              .filter((reservation) => reservation.status !== "Completed") // Filter out completed reservations
              .map((reservation) => (
                <div key={reservation._id} className="reservation-item">
                  <img src={assets.parcel_icon} alt="Reservation Icon" />

                  <div>
                    {/* Display Food Items */}
                    <p className="reservation-item-food">
                      {reservation.items.map((item, idx) =>
                        idx === reservation.items.length - 1
                          ? `${item.foodName} x ${item.quantity}`
                          : `${item.foodName} x ${item.quantity}, `
                      )}
                    </p>

                    {/* Display user information */}
                    <p className="reservation-item-name">
                      <b>Student ID:</b> {reservation.userId?.student_id || "N/A"}
                    </p>
                    <p className="reservation-item-name">
                      <b>Name:</b> {reservation.userId?.name || "N/A"}
                    </p>
                    <p className="reservation-item-name">
                      <b>Email:</b> {reservation.userId?.email || "N/A"}
                    </p>
                  </div>

                  {/* Display Total Amount */}
                  <div>
                    <p><b>Total:</b> ₱{reservation.amount}</p>
                    <p>Balance: ₱{reservation.remainingBalance}</p>
                  </div>
                  {/* Status Dropdown */}
                  <div>
                    <select
                      onChange={(event) => statusHandler(event, reservation._id)}
                      value={reservation.status}
                    >
                      <option value="Food Processing">Food Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Payment Failed</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                    </select>
                  </div>
                </div>
              ))
          ) : (
            <p>No reservations found.</p>
          )}
      </div>
    </div>
  );
};
export default Reservation;
