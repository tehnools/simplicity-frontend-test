import React from 'react';
import WeatherDisplay from '../component/WeatherDisplay';

interface HomePageProps {
  title?: string;
}

const HomePage: React.FC<HomePageProps> = ({ title = 'Welcome' }) => {
  return (
    <div className='page'>
      <h1>{title}</h1>
      <div className='content'>
        <WeatherDisplay />
      </div>
    </div>
  );
};

export default HomePage;
