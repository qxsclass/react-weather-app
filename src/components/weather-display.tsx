import React from 'react';
import { WeatherDisplayProps } from '@/types/types';
import { useTranslation } from 'react-i18next';
import '@/styles/weather-display.scss';

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData }) => {
  const { t } = useTranslation();
  if (!weatherData) return null;

  const getIconClass = (weatherCondition: string): string => {
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
        <h3>{t('weather.title', { city: weatherData.name })}</h3>
        <p>
          {t('weather.temperature', { temp: weatherData.main.temp.toFixed(1) })}
        </p>
        <p>
          {t('weather.feelsLike', {
            feelsLike: weatherData.main.feels_like.toFixed(1),
          })}
        </p>
        <p>{t('weather.humidity', { humidity: weatherData.main.humidity })}</p>
        <p>
          {t('weather.description', {
            description: weatherData.weather[0].description,
          })}
        </p>
      </div>
    </div>
  );
};

export default WeatherDisplay;
