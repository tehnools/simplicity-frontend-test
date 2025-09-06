import React, { useEffect, useState } from 'react';
import { useWeatherForecast } from '../hooks/useWeatherForcast';
import { useDebounce } from '../hooks/useDebounce';

const WeatherDisplay: React.FC = () => {
  const { forecast, loading, error, setCoordinates } = useWeatherForecast();
  const [coords, setCoords] = useState({
    latitude: -36.8509,
    longitude: 174.7645,
  });

  const debouncedCoords = useDebounce(coords, 1000); // 1 second delay

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-NZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  useEffect(() => {
    setCoordinates(debouncedCoords);
  }, [debouncedCoords, setCoordinates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoords((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  if (loading) {
    return <div>Loading weather forecast...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!forecast) {
    return <div>No forecast data available</div>;
  }

  console.log(JSON.stringify(forecast));
  return (
    <div>
      <h2>Weather Forecast</h2>
      <div className='weather-info'>
        <div className='weather-info-box'>
          <p>
            Temperature: {forecast.current_weather.temperature}{' '}
            {forecast.current_weather_units.temperature}
          </p>
          <p>
            Wind Speed: {forecast.current_weather?.windspeed}{' '}
            {forecast.current_units?.wind_speed_10m}
          </p>
          <p>Time: {formatDateTime(forecast.current_weather?.time)}</p>
        </div>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className='coordinates-form'>
        <div>
          <label htmlFor='latitude'>Latitude: </label>
          <input
            id='latitude'
            name='latitude'
            type='number'
            step='any'
            value={coords.latitude}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor='longitude'>Longitude: </label>
          <input
            id='longitude'
            name='longitude'
            type='number'
            step='any'
            value={coords.longitude}
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  );
};

export default WeatherDisplay;
