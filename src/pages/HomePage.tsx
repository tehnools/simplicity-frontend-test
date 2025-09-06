import React from 'react';
import WeatherDisplay from '../component/WeatherDisplay';

interface HomePageProps {
  title?: string;
}

const HomePage: React.FC<HomePageProps> = ({ title = "Noel's Weather App" }) => {
  return (
    <div className='page-container'>
      <div className='page-content'>
        <h1>{title}</h1>
        <div className='content'>
          <WeatherDisplay />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
