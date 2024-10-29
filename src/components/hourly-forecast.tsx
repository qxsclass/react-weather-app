import '@/styles/hourly-forecast.scss';
const HourlyForecast = ({ hourlyData }) => {
  if (!hourlyData) return null;

  return (
    <div className="hourly-forecast-card">
      <h3>今日小时天气</h3>
      <div className="hourly-weather-container">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hour-weather">
            <p>{new Date(hour.dt * 1000).getHours()}:00</p>
            <i className={`wi ${getWeatherIcon(hour.weather[0].id)}`}></i>
            <p>{hour.main.temp.toFixed(1)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const getWeatherIcon = (weatherId) => {
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
  } else {
    return 'wi-cloudy';
  }
};

export default HourlyForecast;
