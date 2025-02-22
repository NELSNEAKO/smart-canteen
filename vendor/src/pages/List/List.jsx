import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const List = ({ url }) => {
  const [list, setList] = useState([]);
  const token = localStorage.getItem('token'); // Get token from local storage
  const navigate = useNavigate();



  const fetchList = async () => {
    if (!token) {
      toast.error("Unauthorized: No token provided"); 
      navigate('/'); // ✅ Redirect after login
      return;
    }

    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        // console.log(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error("Failed to fetch list");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.delete(`${url}/api/food/remove/${foodId}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing food:", error);
      toast.error("Something went wrong!");
    }
  };

  const statusHandler = async (event, foodId, field) => {
    const newValue = event.target.value;
  
    try {
      const payload = { foodId }; // Initialize payload with foodId
  
      // Dynamically update only the field that needs to be changed
      if (field === "status") {
        payload.status = newValue;
      } else if (field === "availability") {
        payload.availability = newValue;
      }
  
      const response = await axios.post(`${url}/api/food/status`, payload);
  
      if (response.data.success) {
        toast.success("Status Updated Successfully");
        fetchList();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Something went wrong!");
    }
  };
  

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Status</b>
          <b>Availability</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div className="list-table-format" key={index}>
            <img src={`${url}/images/${item.image}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₱{item.price}</p>

            {/* Status Dropdown */}
            <div className='list-table-status'>
              <select
                onChange={(event) => statusHandler(event, item.id, "status")}
                value={item.status}
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            {/* Availability Dropdown */}
            <div className='list-table-availability'>
              <select
                onChange={(event) => statusHandler(event, item.id, "availability")}
                value={item.availability}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
              </select>
            </div>

            <p onClick={() => removeFood(item.foodId)} className="cursor">
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
