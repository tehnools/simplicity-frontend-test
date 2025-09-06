import React from 'react';

interface HomePageProps {
  title?: string;
}

const HomePage: React.FC<HomePageProps> = ({ title = 'Welcome' }) => {
  return (
    <div className='page'>
      <h1>{title}</h1>
      <div className='content'>
        <p>This is the home page content.</p>
      </div>
    </div>
  );
};

export default HomePage;
