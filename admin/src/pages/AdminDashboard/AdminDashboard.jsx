import React from "react";
import TotalReservations from "../../components/AdminDashboard/TotalReservations";
import TopFoods from "../../components/TopFoods/TopFoods";
import TotalRevenue from "../../components/TotalRevenue/TotalRevenue";
import InviteCodeGenerator from "../../components/InviteCodeGenerator/InviteCodeGenerator";
import "./AdminDashboard.css";

const AdminPanel = () => {
  return (
    <div className="container">
      <TotalReservations   />
      <TopFoods />
      <TotalRevenue />
      <InviteCodeGenerator />
    </div>
  );
};
export default AdminPanel;
