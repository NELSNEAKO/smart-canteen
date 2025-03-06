import React from "react";
import TotalReservations from "../../components/AdminDashboard/TotalReservations";
import TopFoods from "../../components/TopFoods/TopFoods";
import TotalRevenue from "../../components/TotalRevenue/TotalRevenue";
import InviteCodeGenerator from "../../components/InviteCodeGenerator/InviteCodeGenerator";
import "./AdminDashboard.css";

const AdminPanel = ({url}) => {
  return (
    <div className="container">
      <TotalReservations url={url}/>
      <TopFoods url={url}/>
      <TotalRevenue url={url}/>
      <InviteCodeGenerator url={url}/>
    </div>
  );
};
export default AdminPanel;
