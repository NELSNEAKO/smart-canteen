import React, { useEffect, useState } from 'react';
import  './HomePage.css'
import Header from '../../../components/Header/Header';
import ExploreMenu from '../../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../../components/AppDownload/AppDownload';
import TopFoods from '../../../components/TopFoods/TopFoods';

function HomePage() {

  const [availability, setAvailability] = useState('All');

  return (
    <>
      <Header />
      <ExploreMenu availability={availability} setAvailability={setAvailability}/>
      <FoodDisplay  availability={availability}/>
      <TopFoods />
      <AppDownload />
    </>
  );
}

export default HomePage;  