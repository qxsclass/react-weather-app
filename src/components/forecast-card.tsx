import React from 'react';
import '@/styles/forecast-card.scss';

const ForecastCard = ({ forecastData }) => {
  if (!forecastData) return null;

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

  const formatDateWithZeroPadding = (dateStr) => {
    const parts = dateStr.split('/'); // 假设日期格式为 'YYYY/MM/DD'
    const year = parts[0];
    const month = parts[1].padStart(2, '0'); // 补零确保是两位数
    const day = parts[2].padStart(2, '0'); // 补零确保是两位数
    // return `${year}/${month}/${day}`;
    return day;
  };

  return (
    <div className="forecast-card">
      <h3>未来几天的天气预报</h3>
      {console.log(forecastData)}
      {forecastData.map((day) => (
        <div className="day-row" key={formatDateWithZeroPadding(day.date)}>
          <div className="day-name">{formatDateWithZeroPadding(day.date)}</div>
          <div className="day-name">{day.weekday}</div>
          <i
            className={
              day.condition != '' ? getIconClass(day.condition) : 'wi wi-na'
            }
          ></i>
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
