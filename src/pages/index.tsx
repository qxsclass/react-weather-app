import { useEffect, useState } from 'react';
import { weatherClient } from '@/clients/weather-client';
import '@/styles/wether.scss';
import HourlyForecast from '@/components/hourly-forecast';
import ForecastCard from '@/components/forecast-card';
import WeatherDisplay from '@/components/weather-display';
import { calculateDailyAverages, groupByDay } from '@/utils/deal-daily-wether';
import SpinnerLoading from '@/bases/spinner-loading';
import { WeatherData, WeatherPoint } from '@/types/types';

const WeatherPage = () => {
  const [city, setCity] = useState('Beijing');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherPoint[] | null>(null);
  const [hourlyData, setHourlyData] = useState<WeatherPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initiated, setInitiated] = useState(false);

  const fetchWeatherAndForecast = async () => {
    if (!city) {
      console.error('No city provided for the weather query.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const weatherData = await weatherClient.getWeatherByCity(city);
      const forecastResponse = await weatherClient.getForecastByCity(city);
      setWeather(weatherData);
      setForecast(forecastResponse.list);
      setHourlyData(forecastResponse.list.slice(0, 6));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch weather data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGeoSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const cityNameData = await weatherClient.getCityNameFromCoords(
        latitude.toString(),
        longitude.toString()
      );
      setCity(cityNameData[0]?.name || 'Beijing');
      setInitiated(true);
      await fetchWeatherAndForecast();
    };

    const handleGeoError = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError('Location permission denied');
          break;
        case error.POSITION_UNAVAILABLE:
          setError('Location information is unavailable');
          break;
        case error.TIMEOUT:
          setError('The request to get user location timed out');
          break;
        default:
          setError('An unknown error occurred');
      }
      setCity('Beijing');
      fetchWeatherAndForecast();
    };

    if ('geolocation' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
              handleGeoSuccess,
              handleGeoError
            );
          } else if (permissionStatus.state === 'prompt') {
            navigator.geolocation.getCurrentPosition(
              handleGeoSuccess,
              handleGeoError
            );
          } else {
            // 'denied' or 'disabled'
            setError('Location permission not granted');
            setCity('Beijing');
            fetchWeatherAndForecast();
          }
        });
    } else {
      setError('Geolocation is not supported by this browser');
      setCity('Beijing');
      fetchWeatherAndForecast();
    }
  }, []);

  // 监听城市名称的变化来更新天气信息
  useEffect(() => {
    if (initiated) {
      fetchWeatherAndForecast();
    }
  }, [city, initiated]);

  return (
    <div>
      <div className="input-card">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={fetchWeatherAndForecast} disabled={loading}>
          Get Weather
        </button>
      </div>

      {loading && (
        <div className="text-center">
          <SpinnerLoading />
        </div>
      )}
      {/*{error && <p className="error-message">{error}</p>}*/}
      {weather && <WeatherDisplay weatherData={weather} />}
      {hourlyData && <HourlyForecast hourlyData={hourlyData} />}
      {forecast && (
        <ForecastCard
          forecastData={calculateDailyAverages(groupByDay(forecast))}
        />
      )}
    </div>
  );
};

export default WeatherPage;
