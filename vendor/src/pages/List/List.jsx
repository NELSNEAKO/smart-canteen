import React from 'react'
import { useState, useEffect } from 'react'
import './List.css'
import axios from 'axios'
import {toast} from 'react-toastify'

const List = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if(response.data.success){
      setList(response.data.data)
      console.log(response.data.data);
    } else {
      toast.error(response.data.message)
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.delete(`${url}/api/food/remove/${foodId}`);
    if(response.data.success){
      toast.success(response.data.message)
      fetchList()
    } else {
      toast.error(response.data.message)
    }
  };

  const statusHandler = async (event, paymentId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(`${url}/api/food/status`, {
        paymentId: paymentId,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success('Status Updated Successfully');
        fetchList(); // Refresh data after update
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Something went wrong!');
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
              <p>
                <div className="list-table-status" key={index}>
                  <select
                    onChange={(event) => statusHandler(event, item.status)}
                    value={item.status}
                  >
                    <option value="Available">Availabe</option>
                    <option value="Not Availabe">Not Availabe</option>
                  </select>
                </div>
              </p>
              <p>
                <div className="list-table-availability" key={index}>
                  <select
                    onChange={(event) => statusHandler(event, item.status)}
                    value={item.status}
                  >
                    <option value="Break Fast">Break Fast</option>
                    <option value="Lunch">Lunch</option>
                  </select>
                </div>
              </p>
              <p onClick={() => removeFood(item.id)} className="cursor">X</p>
              </div>
          )
        })}
      </div>
    </div>
  )
}

export default List