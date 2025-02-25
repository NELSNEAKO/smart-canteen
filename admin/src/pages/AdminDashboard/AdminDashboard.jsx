import React from "react";
import TotalReservations from "../../components/AdminDashboard/TotalReservations";
import TopFoods from "../../components/TopFoods/TopFoods";
import "./AdminDashboard.css";

const AdminPanel = () => {
  return (
    <div className="container">
      <TotalReservations   />
      <TopFoods />
    </div>
  );
};

export default AdminPanel;
