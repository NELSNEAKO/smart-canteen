import React, { useEffect, useState } from 'react';
import '../App.css';
import HeroSection from '../components/HeroSection';
import Cards from '../components/Cards';
import Footer from '../components/Footer';

function HomePage() {

  return (
    <>
    <HeroSection />
    <Cards />
    <Footer />
    
    </>
  );
}

export default HomePage;