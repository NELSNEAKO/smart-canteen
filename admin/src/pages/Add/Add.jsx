import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/admin_assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'


const Add = ({url}) => {

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        price:'',
        category: 'Main Dishes',
        status: 'Available',      
        availability: 'Break Fast' 
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data, [name]:value}))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        // console.log('Data before submission:', data); //test
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('price', Number(data.price))
        formData.append('availability', data.availability);
        formData.append('status', data.status);
        formData.append('category', data.category);
        formData.append('image', image)
        const response = await axios.post(`${url}/api/food/add`,formData);
        if(response.data.success){
            console.log('sUCESS add product');
            setData({
                name: '',
                description: '',
                price:'',
                category: 'Main Dishes',
                status: 'Available',
                availability: 'Break Fast' 
            })
            setImage(false);
            toast.success(response.data.message);
        }else{
            toast.error(response.data.message);
        }
    }
   

  return (
    <div className='add'>
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className="add-img-upload">
                <p>Upload Image</p>
                <label htmlFor="image">
                    <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
                </label>
                <input  onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
            </div>
            <div className="add-product-name flex-col">
                <p>Product name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="add-product-description flex-col" >
                <p>Description</p>
                <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
            </div>
            <div className="add-category-price">
                <div className="add-category flex-col">
                    <p>Product category</p>
                    <select onChange={onChangeHandler} name="category">
                        <option value="Main Dishes">Main Dishes</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Desert">Desert</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Pasta">Pasta</option>    
                        <option value="Healthy Options">Healthy Options</option>
                        <option value="Rice Meals">Rice Meals</option>
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>Product price</p>
                    <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='₱10'/>
                </div>
                <div className="add-availability flex-col">
                    <p>Product availability</p>
                    <select onChange={onChangeHandler} name="availability">
                        <option value="Break Fast">Break Fast</option>
                        <option value="Lunch">Lunch</option>
                    </select>
                </div>
                <div className="add-status flex-col">
                    <p>Product status</p>
                    <select onChange={onChangeHandler} name="status" >
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                    </select>
                </div>
            </div>
            <button type='submit' className='add-btn'>ADD</button>
        </form>
    </div>
  )
}

export default Add;
