import React from 'react'
import { Link } from 'react-router-dom'

function foodItem() {
  return (
    <>
       <li className='foods_item'>
            <Link className='foods_item_link'>
                <figure className='cards_item_pic-wrap'>
                    <img src='/' alt='Food Image'
                    className='cards_item_img'
                    ></img>
                </figure>
                <div className='cards_item_info'>
                    <h5 className='cards_item_text' />
                </div>
            </Link>
       </li>
    </>
  )
}

export default foodItem