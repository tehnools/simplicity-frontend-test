import { WeatherClient, WeatherResponse } from '@tehnools/simplicity-backend-test';
import { useState, useEffect } from 'react';

export const useWeatherForecast = () => {
  const [forecast, setForecast] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [coordinates, setCoordinates] = useState({
    latitude: -36.8509,
    longitude: 174.7645,
  }); // default coordinates Auckland NZ

  useEffect(() => {
    let isMounted = true;

    const fetchForecast = async () => {
      setLoading(true);
      const client = new WeatherClient();

      try {
        const [data, error] = await client.getForecast(
          coordinates.latitude,
          coordinates.longitude,
          {
            timezone: 'Pacific/Auckland',
          }
        );

        if (!isMounted) return;

        if (error) {
          setError(error instanceof Error ? error : new Error('Failed to fetch forecast'));
          setForecast(null);
        } else {
          setError(null);
          setForecast(data);
        }
      } catch (e) {
        if (!isMounted) return;
        setError(e instanceof Error ? e : new Error('Unexpected error occurred'));
        setForecast(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchForecast();

    return () => {
      isMounted = false;
    };
  }, [coordinates]); // Add coordinates to dependency array

  return { setCoordinates, forecast, loading, error };
};
