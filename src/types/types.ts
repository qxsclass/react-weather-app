export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    main: string;
  }>;
}

export interface ForecastData {
  dt: number;
  main: {
    temp_max: number;
    temp_min: number;
  };
  weather: Array<{
    description: string;
    main: string;
  }>;
}

export interface HourlyData extends ForecastData {}