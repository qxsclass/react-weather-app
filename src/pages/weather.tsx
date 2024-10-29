import { useEffect, useState } from 'react';
import { weatherClient } from '@/clients/weather-client';
import '@/styles/wether.scss';
import HourlyForecast from '@/components/hourly-forecast';
import ForecastCard from '@/components/forecast-card';
import { calculateDailyAverages, groupByDay } from '@/utils/deal-daily-wether';

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null;

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
        <p>Temperature: {weatherData.main.temp.toFixed(1)}°C</p>
        <p>Feels Like: {weatherData.main.feels_like.toFixed(1)}°C</p>
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Description: {weatherData.weather[0].description}</p>
      </div>
    </div>
  );
};

const MultiDayForecast = ({ forecastData }) => {
  // 安全检查
  if (!forecastData || !Array.isArray(forecastData)) return null;

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="forecast-card">
      <h3>未来几天的天气预报</h3>
      {forecastData.map((day) => (
        <div key={day.dt}>
          <p>
            {formatDate(day.dt)} - {day.main.temp_max.toFixed(1)}°C /{' '}
            {day.main.temp_min.toFixed(1)}°C - {day.weather[0].description}
          </p>
        </div>
      ))}
    </div>
  );
};

const WeatherPage = () => {
  const [city, setCity] = useState('Beijing');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherAndForecast = async () => {
    setLoading(true);
    setError('');
    try {
      const weatherData = await weatherClient.getWeatherByCity(city);
      const forecastResponse = await weatherClient.getForecastByCity(city);
      console.log(forecastResponse);
      setWeather(weatherData);
      setForecast(forecastResponse.list);
      setHourlyData(forecastResponse.list.slice(0, 6));
      console.log(forecast);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // 假设这里有一个函数从API转换经纬度到城市名
        const cityNameData = await weatherClient.getCityNameFromCoords(
          latitude.toString(),
          longitude.toString()
        );
        console.log('Get the city data:');
        console.log(cityNameData);
        setCity(cityNameData[0].name);
        fetchWeatherAndForecast();
      },
      (err) => {
        console.error(err);
        setError('Unable to retrieve your location');
        setCity('Beijing'); // 默认城市
        fetchWeatherAndForecast();
      }
    );
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
        <button onClick={fetchWeatherAndForecast} disabled={loading}>
          Get Weather
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {weather && <WeatherDisplay weatherData={weather} />}
      {hourlyData && <HourlyForecast hourlyData={hourlyData} />}
      {/*{forecast && <MultiDayForecast forecastData={forecast} />}*/}
      {forecast && (
        <ForecastCard
          forecastData={calculateDailyAverages(groupByDay(forecast))}
        />
      )}
    </div>
  );
};

export default WeatherPage;
