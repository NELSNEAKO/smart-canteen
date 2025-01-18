import React from 'react'
import'./HeroSection.css';
import '../App.css';
import { Button } from './button/button';

function HeroSection() {
  return (
    <div className='hero-container'>
        <video src='/videos/video-1.mp4' autoPlay loop muted/>
        <h1>Welcome to Smart Canteen!</h1>
        <p>Your one-stop solution for delicious meals and seamless reservations.</p>
        <div className='hero-btns'>
            <Button 
                className='btns' 
                buttonStyle='btn--outline'
                buttonSize='btn--large'
            >
                Reserve Now
            </Button>
            
        </div>
    </div>
  )
}

export default HeroSection