import React from 'react';
import '@/styles/hourly-forecast.scss';
import { HourlyForecastProps } from '@/types/types';
import { useTranslation } from 'react-i18next';

const getWeatherIcon = (weatherId: number): string => {
  if (weatherId < 300) {
    return 'wi-thunderstorm';
  } else if (weatherId < 500) {
    return 'wi-sprinkle';
  } else if (weatherId < 600) {
    return 'wi-rain';
  } else if (weatherId < 700) {
    return 'wi-snow';
  } else if (weatherId < 800) {
    return 'wi-fog';
  } else if (weatherId === 800) {
    return 'wi-day-sunny';
  } else if (weatherId > 800 && weatherId < 900) {
    return 'wi-cloudy';
  } else {
    return 'wi-na';
  }
};

// Component definition using TypeScript
const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  const { t } = useTranslation();
  if (!hourlyData) return null;

  return (
    <div className="hourly-forecast-card">
      <h3>{t('hourlyWeatherTitle')}</h3>
      <div className="hourly-weather-container">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hour-weather">
            <p>{new Date(hour.dt * 1000).getHours()}:00</p>
            <i
              className={`wi ${hour.weather[0]?.id !== undefined ? getWeatherIcon(hour.weather[0]?.id) : 'wi-na'}`}
            ></i>
            <p>{hour.main.temp.toFixed(1)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
