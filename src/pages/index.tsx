import { useEffect, useState, useCallback } from 'react';
import { weatherClient } from '@/clients/weather-client';
import '@/styles/wether.scss';
import HourlyForecast from '@/components/hourly-forecast';
import ForecastCard from '@/components/forecast-card';
import { calculateDailyAverages, groupByDay } from '@/utils/deal-daily-wether';
import SpinnerLoading from '@/bases/spinner-loading';

interface Index {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

interface Forecast {
  list: WeatherPoint[];
}

type WeatherPoint = WeatherData;

interface WeatherCondition {
  main: string;
  description: string;
  id?: number;
  icon?: string;
}

interface WeatherData {
  name: string;
  main: MainDetails;
  weather: WeatherCondition[];
  wind: {
    speed: number;
  };
}

interface WeatherDisplayProps {
  weatherData: WeatherData;
}
interface MainDetails {
  temp: number;
  feels_like: number;
  humidity: number;
  temp_min?: number;
  temp_max?: number;
  pressure?: number;
  sea_level?: number;
  grnd_level?: number;
  temp_kf?: number;
}

interface Weather {
  main: MainDetails;
  description: string;
}
interface WeatherDisplayProps {
  weatherData: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData }) => {
  if (!weatherData) return null;

  const getIconClass = (weatherCondition: string) => {
    switch (weatherCondition) {
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

const WeatherPage = () => {
  const [city, setCity] = useState('Beijing');
  const [weather, setWeather] = useState<Index | null>(null);
  const [forecast, setForecast] = useState<WeatherPoint[] | null>(null);
  const [hourlyData, setHourlyData] = useState<WeatherPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initiated, setInitiated] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const fetchWeatherAndForecast = async () => {
    if (!city) {
      console.error('No city provided for the weather query.');
      return; // Prevent API call if city is null
    }
    setLoading(true);
    setError('');
    try {
      const weatherData = (await weatherClient.getWeatherByCity(
        city
      )) as WeatherData;
      const forecastResponse = (await weatherClient.getForecastByCity(
        city
      )) as Forecast;
      setWeather(weatherData);
      setForecast(forecastResponse.list);
      setHourlyData(forecastResponse.list.slice(0, 6));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const cityNameData = await weatherClient.getCityNameFromCoords(
          latitude.toString(),
          longitude.toString()
        );
        setCity(cityNameData[0].name || 'Beijing'); // 如果无法获取城市名，默认为北京
        setInitiated(true);
        // fetchWeatherAndForecast(); // 获取天气数据
      },
      (err) => {
        console.error(err);
        setError('Unable to retrieve your location');
        setCity('Beijing'); // 默认城市
        fetchWeatherAndForecast();
      }
    );
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
