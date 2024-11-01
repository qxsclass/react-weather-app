import React from 'react';
import { WeatherData } from '@/types/types';

const WeatherDisplay: React.FC<{ weatherData: WeatherData }> = ({
  weatherData,
}) => {
  if (!weatherData) return null;

  const getIconClass = (weatherMain: string): string => {
    switch (weatherMain) {
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

export default WeatherDisplay;
