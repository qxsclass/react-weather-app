export interface WeatherCondition {
  main: string;
  description: string;
  id?: number;
  icon?: string;
}

export interface MainDetails {
  temp: number;
  feels_like: number;
  humidity: number;
  temp_min?: number;
  temp_max?: number;
  pressure?: number;
  sea_level?: number;
  grnd_level?: number;
  temp_kf?: number;
}

export interface WindDetails {
  speed: number;
  deg?: number;
  gust?: number;
}

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    id?: number;
    icon?: string;
  }>;
  wind: {
    speed: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  sys: {
    country: string;
  };
}

export interface WeatherPoint {
  dt: number;
  main: MainDetails;
  weather: WeatherCondition[];
  wind: WindDetails;
  clouds?: {
    all: number;
  };
  visibility?: number;
  pop?: number;
  rain?: {
    '3h': number;
  };
  sys?: {
    pod: string;
  };
  dt_txt?: string;
}

export interface Forecast {
  list: WeatherPoint[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherDisplayProps {
  weatherData: WeatherData;
}

export interface DayForecast {
  date: string;
  weekday: string;
  condition: string;
  maxTemp: number | null;
  minTemp: number | null;
  averageTemp: number | null;
  averageFeelsLike: number | null;
}

export interface HourWeather {
  dt: number;
  main: {
    temp: number;
  };
  weather: WeatherCondition[];
}

export interface HourlyForecastProps {
  hourlyData: HourWeather[];
}

export interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  local_names?: Record<string, string>;
  state?: string;
}
