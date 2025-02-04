import React from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'


function PlaceOrder() {

  const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext)
  const [data, setData] = useState({
    firstName: '',
  })
  return (
    <form className='place-order'>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multifields">
            
          </div>
        </div>
        <div className="place-order-right">

        </div>
    </form >
  )
}

export default PlaceOrder