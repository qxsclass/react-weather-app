import { apiClient } from './base/api-client';
import { z } from 'zod';
import { getConfig } from '@/configs';
import '@/assets/styles/index.scss';
import { WeatherData, Forecast, Location } from '@/types/types';
import i18n from '@/i18n';

export interface GeoLocation {
  lat: number;
  lon: number;
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
      id: z.number().optional(),
      icon: z.string().optional(),
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

const LocationSchema = z.object({
  name: z.string(),
  local_names: z.record(z.string()).optional(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});

const LocationsSchema = z.array(LocationSchema);

const config = getConfig();
const apiKey = config.openWeatherApiKey;

export const getLatLonByCity = async (
  city: string
): Promise<GeoLocation | undefined> => {
  try {
    const response = await apiClient<Location[]>({
      method: 'GET',
      url: `https://api.openweathermap.org/geo/1.0/direct`,
      zodSchema: LocationsSchema,
      queryParams: {
        q: city,
        appid: apiKey,
        limit: '1',
        lang: 'en',
      },
    });

    if (response && response.length > 0) {
      const location = response[0];
      return {
        lat: location.lat,
        lon: location.lon,
      };
    }
  } catch (e) {
    console.error('Failed to fetch geolocation:', e);
  }
  return undefined;
};

export const getWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  return apiClient({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather`,
    zodSchema: WeatherSchema,
    queryParams: {
      lat: lat.toString(),
      lon: lon.toString(),
      appid: apiKey,
      units: 'metric',
      lang: 'en',
    },
  });
};

export const weatherClient = {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    console.log(apiKey);
    const language = i18n.language;
    return apiClient({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather`,
      zodSchema: WeatherSchema,
      queryParams: {
        q: city,
        appid: apiKey,
        units: 'metric',
        lang: language,
      },
    });
  },

  async getForecastByCity(city: string): Promise<Forecast> {
    const language = i18n.language;
    console.log(language);
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
        lang: language,
      },
    });
  },

  async getGeosByCity(city: string): Promise<Location[]> {
    const language = i18n.language;
    return apiClient({
      method: 'GET',
      // https://openweathermap.org/api/geocoding-api
      url: `https://api.openweathermap.org/geo/1.0/direct`,
      zodSchema: LocationsSchema,
      queryParams: {
        q: city,
        appid: apiKey,
        limit: '1',
        lang: language,
      },
    });
  },

  async getCityNameFromCoords(lat: string, lon: string) {
    const language = i18n.language;
    return apiClient({
      method: 'GET',
      url: `https://api.openweathermap.org/geo/1.0/reverse`,
      zodSchema: LocationsSchema,
      queryParams: {
        lat,
        lon,
        limit: '1',
        appid: apiKey,
        lang: language,
      },
    });
  },

  async getCitySuggestions(query: string) {
    const language = i18n.language;
    return apiClient({
      method: 'GET',
      url: `https://api.openweathermap.org/geo/1.0/direct`,
      zodSchema: LocationsSchema,
      queryParams: {
        q: query,
        limit: '5',
        appid: apiKey,
        lang: language,
      },
    });
  },
  getLatLonByCity,
  getWeatherByCoords,
};
