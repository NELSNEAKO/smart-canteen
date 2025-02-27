import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

function FoodDisplay({availability}) {

    const {food_list} = useContext(StoreContext);


  return (
    <div className='food-display' id='food-display'>
        <div className="food-display-list">
            {food_list.map((item,index)=>{
              if(availability==='All' || availability===item.availability ){
                  return <FoodItem key={index} id={item.id} name={item.name} description={item.description} 
                  price={item.price} image={item.image} category={item.category}/>
              }
            })}
        </div>
    </div>
  )
}

export default FoodDisplay