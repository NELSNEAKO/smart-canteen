import React, { useEffect, useState } from 'react';
import  './HomePage.css'
import Header from '../../../components/Header/Header';
import ExploreMenu from '../../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../../components/AppDownload/AppDownload';
import TopFoods from '../../../components/TopFoods/TopFoods';
import RecentFood from '../../../components/RecentFood/RecentFood';

function HomePage() {

  const [availability, setAvailability] = useState('All');

  return (
    <>
      <Header />
      <TopFoods />
      <ExploreMenu availability={availability} setAvailability={setAvailability}/>
      <FoodDisplay  availability={availability}/>
      <RecentFood />
      <AppDownload />
    </>
  );
}

export default HomePage;  