import React, { useContext, useEffect, useState } from "react";
import "./MyReservations.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/frontend_assets/assets";
import axios from "axios";

const MyReservations = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    // Fetch reservations from API
    const fetchReservations = async () => {
        try {
            const response = await axios.post(
                `${url}/api/payment/user-reservations`,
                {},  // ✅ No need to send userId, extracted from token
                { headers: { token } }  // ✅ Send token in headers
            );

            if (response.data.success) {
                // console.log("Reservations:", response.data.data);
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
                                {reservation.ReservationItems?.map(
                                    (item) => `${item.FoodItem?.name} x ${item.quantity}`
                                ).join(", ")}
                            </p>

                            {/* Calculate Total Amount from Payments */}
                            <p>
                                Total: ₱
                                {Math.round(
                                    (reservation.ReservationItems || []).reduce(
                                        (total, item) => total + (item.Payment?.amount || 0),
                                        0
                                    )
                                )}
                            </p>

                            {/* Display Item Count */}
                            <p>Items: {reservation.ReservationItems?.length || 0}</p>

                            {/* Display Status */}
                            <p>
                                <span>&#x25cf;</span> <b>{reservation.ReservationItems?.[0]?.Payment?.status || "Pending"}</b>
                            </p>

                            <button onClick={fetchReservations}>Track Reservation</button>
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
