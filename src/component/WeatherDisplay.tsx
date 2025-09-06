import React from 'react';
import { useWeatherForecast } from '../hooks/useWeatherForcast';

const WeatherDisplay: React.FC = () => {
  const { forecast, loading, error } = useWeatherForecast();

  if (loading) {
    return <div>Loading weather forecast...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!forecast) {
    return <div>No forecast data available</div>;
  }

  return (
    <div>
      <h2>Weather Forecast</h2>
      <div>
        <p>Temperature: {forecast.current?.temperature_2m}°C</p>
        <p>Wind Speed: {forecast.current?.wind_speed_10m}</p>
        <p>Time: {forecast.current?.time}</p>
      </div>
    </div>
  );
};

export default WeatherDisplay;
