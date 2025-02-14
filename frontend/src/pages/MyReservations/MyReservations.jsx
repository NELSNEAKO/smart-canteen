import React, { useContext, useEffect, useState } from 'react';
import './MyReservations.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/frontend_assets/assets';
import axios from 'axios';

const MyReservations = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const fetchReservations = async () => {
        try {
            const response = await axios.post(
                `${url}/api/payment/user-reservations`,
                { userId: localStorage.getItem("userId") },  // ✅ Pass userId
                { headers: { token } }
            );

            if (response.data.success) {
                console.log(response.data.data);
                setData(response.data.data);
            } else {
                setError("Failed to fetch reservations.");
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
            setError("Error fetching reservations. Please try again.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchReservations();
        }
    }, [token]);

    return (
        <div className="my-reservations">
            <h2>My Reservations</h2>

            {error && <p className="error-message">{error}</p>}

            <div className="container">
                {data.length > 0 ? (
                    data.map((reservation, index) => (
                        <div key={index} className="my-reservations-reservation">
                            <img src={assets.parcel_icon} alt="Reservation Icon" />
                            
                            {/* Display Food Items */}
                            <p>
                                {reservation.ReservationItems?.map((item) =>
                                    `${item.FoodItem?.name} x ${item.quantity}`
                                ).join(", ")}
                            </p>

                            {/* Get Amount from Payment Table */}
                            <p>Total: ₱{Math.round(reservation.ReservationItems.reduce((total, item) => 
                                total + (item.Payment?.amount || 0), 0))}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="no-reservations">No reservations found.</p>
                )}
            </div>
        </div>
    );
};

export default MyReservations;
