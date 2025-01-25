import React from 'react'
import { useState, useEffect } from 'react'
import './List.css'
import axios from 'axios'
import {toast} from 'react-toastify'

const List = () => {

  const url = 'http://localhost:5000'
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if(response.data.success){
      setList(response.data.data)
    } else {
      toast.error(response.data.message)
    }
  }

  const removeFood = async (foodId) => {
    try {
      // Log the foodId to ensure it's passed correctly
      console.log(`Attempting to remove food with ID: ${foodId}`);
  
      // Make the API call to delete the food item
      const response = await axios.delete(`${url}/api/food/remove/${foodId}`);
      
      // Log the response to see what is returned
      console.log("Response from API:", response.data);
  
      // Check if the deletion was successful
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // Refresh the food list
      } else {
        // If not successful, log the message for debugging
        console.log("Failed to remove food:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      // Log the complete error object to understand it better
      console.error("There was an error removing the food item:", error);
  
      // Optionally, you can log the error stack trace for further debugging
      console.error("Error stack trace:", error.stack);
  
      // Show a user-friendly message
      toast.error("Failed to remove food item.");
    }
  };
  

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='list add flex-col'>
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
        {list.map((item,index)=>{
          return(
            <div className="list-table-format" key={index}>
              <img src={`${url}/images/`+item.image} alt='' />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₱{item.price}</p>
              <p>{item.status}</p>
              <p>{item.availability}</p>
              <p onClick={() => removeFood(item.id)} className="cursor">X</p>
              </div>
          )
        })}
      </div>
    </div>
  )
}

export default List