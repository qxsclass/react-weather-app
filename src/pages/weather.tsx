import { useEffect, useState } from 'react';
import { weatherClient } from '@/clients/weather-client';
import '@/styles/wether.scss';

// Separate WeatherDisplay component
const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null; // Don't render if no weather data is available

  const getIconClass = (weather) => {
    switch (weather) {
      case 'Clear':
        return 'wi wi-day-sunny';
      case 'Clouds':
        return 'wi wi-cloudy';
      case 'Rain':
        return 'wi wi-rain';
      default:
        return 'wi wi-na';
    }
  };

  return (
    <div className="weather-container">
      <i className={getIconClass(weatherData.weather[0].main)}></i>
      <div>
        <h3>Weather in {weatherData.name}</h3>
        <p>Temperature: {weatherData.main.temp}°C</p>
        <p>Feels Like: {weatherData.main.feels_like}°C</p>
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Description: {weatherData.weather[0].description}</p>
      </div>
    </div>
  );
};

const WeatherPage = () => {
  const [city, setCity] = useState('Chengdu');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) return; // Ensure there is a city set
    setLoading(true);
    setError('');
    try {
      const data = await weatherClient.getWeatherByCity(city);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(); // Call on component mount and when city changes
  }, [city]);

  return (
    <div>
      <div className="input-card">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={fetchWeather} disabled={loading}>
          Get Weather
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {weather && <WeatherDisplay weatherData={weather} />}
    </div>
  );
};

export default WeatherPage;
