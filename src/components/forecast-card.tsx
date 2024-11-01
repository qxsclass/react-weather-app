import React from 'react';
import '@/styles/forecast-card.scss';

// Define an interface for a single day's forecast data
interface DayForecast {
  date: string; // assuming date is a string for simplicity, e.g., '2024/10/29'
  weekday: string;
  condition: string;
  maxTemp: number;
  minTemp: number;
}

// Define props for the ForecastCard component
interface ForecastCardProps {
  forecastData: DayForecast[];
}

// Additional utility functions for formatting
const getIconClass = (weather: string): string => {
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

const formatDateWithZeroPadding = (dateStr: string): string => {
  const parts = dateStr.split('/'); // Assuming date format 'YYYY/MM/DD'
  const day = parts[2].padStart(2, '0'); // Pad day to ensure two digits
  return day;
};

const ForecastCard: React.FC<ForecastCardProps> = ({ forecastData }) => {
  if (!forecastData) return null;

  return (
    <div className="forecast-card">
      <h3>未来几天的天气预报</h3>
      {forecastData.map((day) => (
        <div className="day-row" key={formatDateWithZeroPadding(day.date)}>
          <div className="day-name">{formatDateWithZeroPadding(day.date)}</div>
          <div className="day-name">{day.weekday}</div>
          <i className={getIconClass(day.condition)}></i>
          <div className="temp-range">
            <div
              className="temp-fill"
              style={{ width: `${(day.maxTemp - day.minTemp) * 10}%` }}
            ></div>
          </div>
          <div className="temp-label">
            {day.minTemp}°C / {day.maxTemp}°C
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForecastCard;
