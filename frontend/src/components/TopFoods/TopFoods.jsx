import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./TopFoods.css";

const TopFoods = () => {
  const { url, topList } = useContext(StoreContext);

  return (
    <>
    <h1 className="top-header">Your top foods!</h1>
      <div className="toplist-container">
        {topList.map((item, index) => (
          <div key={index} className="toplist-item">
            <img
              src={`${url}/images/${item.image}`}
              alt={item.name}
              className="toplist-image"
            />
            <div className="toplist-content">
              <span className="category">{item.category}</span>
              <h3 className="food-title">{item.name}</h3>
              <p className="rank">#<span className="rank-number">{index + 1}</span></p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TopFoods;
