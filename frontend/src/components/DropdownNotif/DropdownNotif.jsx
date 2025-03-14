import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./DropdownNotif.css";
import { assets } from "../../assets/frontend_assets/assets";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const DropdownNotif = () => {
  const { url } = useContext(StoreContext);
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReservations();
  }, [token]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${url}/api/reservation/latest`, {
        headers: { token },
      });
      
      const hiddenNotifs = JSON.parse(localStorage.getItem("studentHiddenNotifs")) || [];

      // Filter out hidden notifications
      const filteredNotifs = response.data.data.filter(notif => !hiddenNotifs.includes(notif._id));
      setNotifications(filteredNotifs);
    } catch (error) {
      console.error("Error fetching latest reservation:", error);
    }
  };

  // Hide notification and store in localStorage
  const handleRemoveNotif = (notifId) => {
    const updatedNotifs = notifications.filter(notif => notif._id !== notifId);
    setNotifications(updatedNotifs);

    const hiddenNotifs = JSON.parse(localStorage.getItem("studentHiddenNotifs")) || [];
    hiddenNotifs.push(notifId);
    localStorage.setItem("studentHiddenNotifs", JSON.stringify(hiddenNotifs));
  };

  return (
    <div className="nav2-notif">
      {/* Notification Icon */}
      <div className="notif-icon">
        <img src={assets.notification} alt="notif icon" />

        {/* Show dot if there are pending notifications */}
        {notifications.some(n => n.status !== "Completed") && <div className="dot"></div>}
        
        {/* Dropdown on Hover */}
        <ul className="nav2-notif-dropdown">
          <h2 className="notif-header">Notifications</h2>
          <Link to='/myReservations'>
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <li key={index} className="notif-item">
                  <div className="notif-item-left">
                    <img src={assets.parcel_icon} alt="" />
                  </div>
                  <div className="notif-item-right">
                    <p>
                      {notif.items?.map(item => `${item.foodName} x ${item.quantity}`).join(", ")}
                    </p>
                    <p>Payment: {notif.payment ? "Successful" : "Failed"}</p>
                    <small>{new Date(notif.date).toLocaleString()}</small>
                  </div>

                  {/* Click "X" to hide notification */}
                  <p className="notif-close" onClick={() => handleRemoveNotif(notif._id)}>X</p>
                </li>
              ))
            ) : (
              <li className="notif-empty">No new notifications.</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default DropdownNotif;
