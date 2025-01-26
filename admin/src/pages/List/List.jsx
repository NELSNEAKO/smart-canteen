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