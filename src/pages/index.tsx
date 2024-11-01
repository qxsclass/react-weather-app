import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { weatherClient } from '@/clients/weather-client';
import '@/styles/index.scss';
import '@/styles/input-card.scss';
import HourlyForecast from '@/components/hourly-forecast';
import ForecastCard from '@/components/forecast-card';
import WeatherDisplay from '@/components/weather-display';
import { calculateDailyAverages, groupByDay } from '@/utils/deal-daily-wether';
import SpinnerLoading from '@/bases/spinner-loading';
import { WeatherData, WeatherPoint } from '@/types/types';
import { useDebounce } from '@/utils/debounce';
import '@/i18n';
import LanguageSwitcher from '@/components/atoms/language-switcher';

const WeatherPage = () => {
  const { t, i18n } = useTranslation();
  const [city, setCity] = useState('Beijing');
  // const [debouncedCity, setDebouncedCity] = useState<string>(city);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherPoint[] | null>(null);
  const [hourlyData, setHourlyData] = useState<WeatherPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initiated, setInitiated] = useState(false);

  const handleLanguageChange = (language: string) => {
    console.log(`Language changed to: ${language}`);
    fetchWeatherAndForecast(city);
  };

  // use debounce
  const debouncedSearchTerm = useDebounce(city, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchWeatherAndForecast(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const fetchWeatherAndForecast = async (cityName: string) => {
    if (!cityName || cityName.length < 3) {
      // 输入长度不足，不发送请求
      return;
    }
    if (!city) {
      console.error('No city provided for the weather query.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const weatherData = await weatherClient.getWeatherByCity(cityName);
      const forecastResponse = await weatherClient.getForecastByCity(cityName);
      console.log(forecastResponse);
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
      const cityName = cityNameData[0]?.name || 'Beijing';
      setCity(cityNameData[0]?.name || 'Beijing');
      setInitiated(true);
      await fetchWeatherAndForecast(cityName);
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
      const defaultCity = 'Beijing';
      setCity(defaultCity);
      fetchWeatherAndForecast(defaultCity);
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
            fetchWeatherAndForecast(city);
          }
        });
    } else {
      setError('Geolocation is not supported by this browser');
      setCity('Beijing');
      fetchWeatherAndForecast(city);
    }
  }, []);

  // // 监听城市名称的变化来更新天气信息
  // useEffect(() => {
  //   if (initiated) {
  //     fetchWeatherAndForecast(city);
  //   }
  // }, [city, initiated]);
  // 切换语言函数

  return (
    <div>
      <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      <div className="input-card">
        <input
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setError(''); // 清除错误信息
          }}
          placeholder={t('cityPlaceholder')}
        />
        <button
          onClick={() => fetchWeatherAndForecast(city)}
          disabled={loading}
        >
          {t('getWeather')}
        </button>
      </div>

      {loading && (
        <div className="spinner-container">
          <SpinnerLoading />
          <p>{t('loading')}</p>
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
