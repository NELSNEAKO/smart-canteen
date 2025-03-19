import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./VendorNotif.css";
import { assets } from "../../assets/frontend_assets/assets";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const VendorNotif = () => {
  const { url } = useContext(StoreContext);
  const [notifications, setNotifications] = useState([]);

  
  const fetchAllReservations = async () => {
    try {
      const response = await axios.get(`${url}/api/reservation/list`);
      if (response.data.success) {
        // console.log(response.data.data);
        
        const hiddenNotifs = JSON.parse(localStorage.getItem("hiddenNotifs")) || [];
        
        // Filter out hidden notifications
        const filteredNotifs = response.data.data.filter(notif => !hiddenNotifs.includes(notif._id));
        setNotifications(filteredNotifs);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }

  };

     // Load hidden notifications and fetch data only if the token exists
     useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        fetchAllReservations();
      }
    }, []);

  // Hide notification and store in localStorage
  const handleRemoveNotif = (notifId) => {
    const updatedNotifs = notifications.filter(notif => notif._id !== notifId);
    setNotifications(updatedNotifs);

    // Save hidden notifications
    const hiddenNotifs = JSON.parse(localStorage.getItem("hiddenNotifs")) || [];
    hiddenNotifs.push(notifId);
    localStorage.setItem("hiddenNotifs", JSON.stringify(hiddenNotifs));

  };

  return (
    <div className="nav2-notif">
      <div className="notif-icon">
        <img src={assets.notification} alt="notif icon" />
        {notifications.some(n => n.status !== "Completed") && <div className="dot"></div>}

        <ul className="nav2-notif-dropdown-vendor">
          <h2 className="notif-header">Notifications</h2>

          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <li key={index} className="notif-item">
                <div className="notif-item-left">
                  <img src={assets.parcel_icon} alt="" />
                </div>
                <div className="notif-item-right">
                  <p>Name: {notif.userId?.name || 'Uknown'}</p>
                  <p>Student Id: {notif.userId?.student_id || 'N/A'}</p>
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
        </ul>
      </div>
    </div>
  );
};

export default VendorNotif;
