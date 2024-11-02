import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { weatherClient, sanitizeCityName } from '@/clients/weather-client';
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
import '@/styles/error-message.scss';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

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
    i18n.changeLanguage(language).then(() => {
      localStorage.setItem('language', language);
      fetchWeatherAndForecast(city);
    });
  };

  // use debounce
  const debouncedSearchTerm = useDebounce(city, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchWeatherAndForecast(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const fetchWeatherAndForecast = async (cityName: string) => {
    if (!cityName) {
      setError(t('error.noCityProvided'));
      return;
    }

    // 城市名长度验证逻辑
    const isChinese = /[\u4e00-\u9fa5]/.test(cityName);
    if (
      (isChinese && cityName.length < 2) ||
      (!isChinese && cityName.length < 3)
    ) {
      setError(t('error.cityNameTooShort'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const translatedCityName =
        await weatherClient.translateCityName(cityName);
      console.log(`Translated city name: ${cityName} -> ${translatedCityName}`);

      const weatherData =
        await weatherClient.getWeatherByCity(translatedCityName);
      if (!weatherData) {
        setError(t('error.cityNotFound'));
        return;
      }

      const forecastResponse =
        await weatherClient.getForecastByCity(translatedCityName);
      if (!forecastResponse) {
        setError(t('error.cityNotFound'));
        return;
      }

      setWeather(weatherData);
      setForecast(forecastResponse.list);
      setHourlyData(forecastResponse.list.slice(0, 6));
    } catch (err: unknown) {
      console.error('Error details:', err);

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as ApiError;
        if (axiosError.response?.data?.message === 'city not found') {
          setError(t('error.cityNotFound'));
        } else {
          setError(t('error.generalError'));
        }
      } else if (err instanceof Error) {
        if (err.message.includes('city not found')) {
          setError(t('error.cityNotFound'));
        } else if (err.message.includes('translation failed')) {
          setError(t('error.translationFailed'));
        } else {
          setError(t('error.generalError'));
        }
      } else {
        setError(t('error.unknownError'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGeoSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const response = await weatherClient.getCityNameFromCoords(
        latitude.toString(),
        longitude.toString()
      );

      if (response && response.length > 0) {
        const cityName = response[0].name || 'Beijing';
        setCity(cityName);
        setInitiated(true);
        await fetchWeatherAndForecast(cityName);
      } else {
        setCity('Beijing');
        await fetchWeatherAndForecast('Beijing');
      }
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

  // 添加错误消失的计时器效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (error) {
      timer = setTimeout(() => {
        setError('');
      }, 4000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [error]);

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && ['en', 'zh'].includes(savedLang)) {
      i18n.changeLanguage(savedLang);
    } else {
      const browserLang = navigator.language.toLowerCase();
      const initialLang = browserLang.startsWith('zh') ? 'zh' : 'en';
      i18n.changeLanguage(initialLang);
    }
  }, []);

  return (
    <div>
      <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      <div className="input-card">
        <input
          type="text"
          value={city}
          onChange={(e) => {
            const sanitizedValue = sanitizeCityName(e.target.value);
            setCity(sanitizedValue);
            setError('');
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
      {error && (
        <p
          className={`error-message ${error.includes('not found')
              ? 'warning'
              : error.includes('failed')
                ? 'critical'
                : ''
            }`}
        >
          {error}
        </p>
      )}
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
