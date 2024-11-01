import React from 'react';
import '@/styles/forecast-card.scss';
import { DayForecast } from '@/types/types';
import { useTranslation } from 'react-i18next';

interface ForecastCardProps {
  forecastData: DayForecast[];
}

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
  const parts = dateStr.split('/');
  const day = parts[2].padStart(2, '0');
  return day;
};

const ForecastCard: React.FC<ForecastCardProps> = ({ forecastData }) => {
  const { t } = useTranslation();
  if (!forecastData) return null;

  // Step 1: Calculate global min and max temperatures for the range
  const temps = forecastData
    .flatMap((day) => [day.minTemp, day.maxTemp])
    .filter((temp): temp is number => temp !== null);
  const globalMin = Math.min(...temps);
  const globalMax = Math.max(...temps);

  return (
    <div className="forecast-card">
      <h3>{t('forecastTitle')}</h3>
      {forecastData.map((day) => {
        const averageTemp = ((day.maxTemp ?? 0) + (day.minTemp ?? 0)) / 2;
        const width =
          ((averageTemp - globalMin) / (globalMax - globalMin)) * 100;
        const backgroundColor = `rgba(240, ${Math.floor((1 - (averageTemp - globalMin) / (globalMax - globalMin)) * 255)}, 100, 0.8)`;

        return (
          <div className="day-row" key={formatDateWithZeroPadding(day.date)}>
            <div className="day-name">
              {formatDateWithZeroPadding(day.date)}
            </div>
            <div className="weekday-name">{t(day.weekday)}</div>
            <i className={getIconClass(day.condition)}></i>
            <div className="temp-range-container">
              <div className="temp-range">
                <div
                  className="temp-fill"
                  style={{
                    width: `${width}%`,
                    backgroundColor: backgroundColor,
                  }}
                ></div>
              </div>
              <div className="temp-label">
                {day.minTemp !== null && day.maxTemp !== null
                  ? `${day.minTemp.toFixed(1)}°C / ${day.maxTemp.toFixed(1)}°C`
                  : 'N/A'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ForecastCard;
