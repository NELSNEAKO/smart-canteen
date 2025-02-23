import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";

const ExploreMenu = ({ availability, setAvailability }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Today's Meal</h1>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          const isActive = availability === item.menu_name;
          return (
            <div
              key={index}
              className={`explore-menu-list-item ${isActive ? "active" : ""}`}
              onClick={() =>
                setAvailability((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
            >
              <div className="meal-card">
                <img src={item.menu_image} alt={item.menu_name} />
                <p>{item.menu_name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMenu;
