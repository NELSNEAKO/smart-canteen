import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these TOP FOODS!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='/images/fried-chicken.jpg'
              text='Indulge in crispy fried chicken with a side of spicy sauce.'
              label='Fried Chicken'
              path='/menu/fried-chicken'
            />
            <CardItem
              src='/images/pepperoni-pizza.jpg'
              text='Savor the rich flavors of a classic pepperoni pizza.'
              label='Pepperoni Pizza'
              path='/menu/pepperoni-pizza'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='/images/iced-coffee.jpg'
              text='Refresh yourself with a cold, creamy iced coffee.'
              label='Iced Coffee'
              path='/menu/iced-coffee'
            />
            <CardItem
              src='/images/chocolate-cake.jpg'
              text='Experience the sweetness of a decadent chocolate cake.'
              label='Chocolate Cake'
              path='/menu/'
            />
            <CardItem
              src='/images/salad-bowl.jpg'
              text='Enjoy a fresh salad bowl packed with healthy greens.'
              label='Salad Bowl'
              path='/menu/'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}


export default Cards;