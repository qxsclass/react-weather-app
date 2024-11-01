import { apiClient } from './base/api-client';
import { z } from 'zod';
import { getConfig } from '@/configs';
import '@/assets/styles/index.scss';

// Define the expected structure of the location response
interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  local_names?: Record<string, string>;
  state?: string;
}

// This could be the expected structure of the getGeosByCity response
interface GeoResponse {
  data: Location[];
}

interface Weather {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}
interface Forecast {
  list: WeatherPoint[];
}

interface WeatherPoint {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    main: string;
    description: string;
    id: number;
    icon: string;
  }[];
}



const WeatherSchema = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
  }),
  weather: z.array(
    z.object({
      main: z.string(),
      description: z.string(),
    })
  ),
  wind: z.object({
    speed: z.number(),
  }),
});

const WeatherPointSchema = z.object({
  dt: z.number(), // 时间戳
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    sea_level: z.number(),
    grnd_level: z.number(),
    humidity: z.number(),
    temp_kf: z.number(),
  }),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
  clouds: z.object({
    all: z.number(),
  }),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
    gust: z.number(),
  }),
  visibility: z.number(),
  pop: z.number(),
  rain: z.optional(
    z.object({
      '3h': z.number(),
    })
  ),
  sys: z.object({
    pod: z.string(),
  }),
  dt_txt: z.string(),
});

// 定义整个天气预报的模式
// https://openweathermap.org/forecast5
const ForecastSchema = z.object({
  cod: z.string(),
  message: z.number(),
  cnt: z.number(),
  list: z.array(WeatherPointSchema),
  city: z.object({
    id: z.number(),
    name: z.string(),
    coord: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    country: z.string(),
    population: z.number(),
    timezone: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
});

const DailyForecastSchema = z.object({
  date: z.number(),
  temp: z.object({
    day: z.number(),
    min: z.number(),
    max: z.number(),
    night: z.number(),
    eve: z.number(),
    morn: z.number(),
  }),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
  pressure: z.number(),
  humidity: z.number(),
});

const LocationSchema = z.object({
  name: z.string(),
  local_names: z.record(z.string()).optional(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional()
});

const LocationsSchema = z.array(LocationSchema);


const config = getConfig();
const apiKey = config.openWeatherApiKey;

export const weatherClient = {
  async getWeatherByCity(city: string) {
    console.log(apiKey);
    return apiClient({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather`,
      zodSchema: WeatherSchema,
      queryParams: {
        q: city,
        appid: apiKey,
        units: 'metric',
        lang: 'zh_cn',
      },
    });
  },

  async getForecastByCity(city: string) {
    return apiClient({
      method: 'GET',
      // https://api.openweathermap.org/data/2.5/onecall
      url: `https://api.openweathermap.org/data/2.5/forecast`,
      zodSchema: ForecastSchema,
      queryParams: {
        q: city,
        exclude: 'minutely,hourly,current,alerts',
        appid: apiKey,
        units: 'metric',
        lang: 'zh_cn',
      },
    });
  },

  async getGeosByCity(city: string): Promise<Location[]>{
    return apiClient({
      method: 'GET',
      // https://openweathermap.org/api/geocoding-api
      url: `http://api.openweathermap.org/geo/1.0/direct`,
      zodSchema: LocationsSchema,
      queryParams: {
        q: city,
        appid: apiKey,
        limit: '1',
        lang: 'zh_cn',
      },
    });
  },

  async getCityNameFromCoords(lat: string, lon: string) {
    return apiClient({
      method: 'GET',
      url: `http://api.openweathermap.org/geo/1.0/reverse`,
      zodSchema: LocationsSchema,
      queryParams: {
        lat,
        lon,
        limit: '1',
        appid: apiKey,
        lang: 'zh_cn',
      },
    });
  },

  async getCitySuggestions(query: string) {
    return apiClient({
      method: 'GET',
      url: `http://api.openweathermap.org/geo/1.0/direct`,
      zodSchema: LocationsSchema,
      queryParams: {
        q: query,
        limit: '5',
        appid: apiKey,
      },
    });
  },
};
