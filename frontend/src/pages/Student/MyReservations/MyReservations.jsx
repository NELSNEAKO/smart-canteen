import React, { useContext, useEffect, useState } from "react";
import "./MyReservations.css";
import { StoreContext } from "../../../context/StoreContext";
import { assets } from "../../../assets/frontend_assets/assets";
import axios from "axios";

const MyReservations = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch reservations from API
    const fetchReservations = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${url}/api/reservation/user-reservations`,
                {},  // ✅ No need to send userId, extracted from token
                { headers: { token } }  // ✅ Send token in headers
            );
            
            if (response.data.success) {
                setData(response.data.data);
                // console.log("Reservations:", response.data.data);
            } else {
                setError("Failed to fetch reservations.");
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
            setError("Error fetching reservations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [token]);

    return (
        <div className="my-reservations">
            <h2>My Reservations</h2>
            {error && <p className="error-message">{error}</p>}
            {loading && <p>Loading reservations...</p>}

            <div className="container">
                {data.length > 0 ? (
                    data.map((reservation, index) => (
                        <div key={index} className="my-reservations-reservation">
                            <img src={assets.parcel_icon} alt="Reservation Icon" />

                            {/* Display Food Items */}
                            <p>
                                {reservation.items?.map(
                                    (item) => `${item.foodName} x ${item.quantity}`
                                ).join(", ")}   
                            </p>
                            <div>
                                {/* Calculate Total Amount */}
                                <p>Total: ₱{reservation.amount}</p>

                                {/* ✅ Show Balance only if payment is NOT failed and NOT completed */}
                                {reservation.status === "Completed" ? ( <p>Balance: Paid</p> ) : reservation.status !== "Payment Failed" && 
                                 ( <p>Balance pay at counter: ₱{reservation.remainingBalance}</p> )
                                }
                            </div>        

                            {/* Display Status */}
                            <p>
                                <span>&#x25cf;</span> <b>{reservation.status}</b>
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
