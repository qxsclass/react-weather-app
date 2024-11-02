import { apiClient } from './base/api-client';
import { z } from 'zod';
import { getConfig } from '@/configs';
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
  dt: z.number(),
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

interface TranslationResponse {
  data: {
    result: {
      trans_result: Array<{
        dst: string;
      }>;
    };
  };
}

// Filter out invalid characters from city name
export function sanitizeCityName(cityName: string): string {
  const sanitized = cityName
    .replace(/[^\u4e00-\u9fa5a-zA-Z\s\-']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return sanitized || cityName;
}

export const weatherClient = {
  async translateCityName(cityName: string): Promise<string> {
    try {
      const sanitizedCityName = sanitizeCityName(cityName);
      if (!sanitizedCityName) {
        return cityName;
      }

      const isEnglishOrPinyin = /^[a-zA-Z\s\-']+$/.test(sanitizedCityName);
      if (isEnglishOrPinyin) {
        return sanitizedCityName;
      }

      const response = await apiClient<TranslationResponse>({
        method: 'POST',
        url: '/api/translate',
        body: {
          text: sanitizedCityName,
          from: 'auto',
          to: 'en',
        },
      });

      console.log('Translation response:', response);

      if (
        response.success &&
        response.data?.data?.result?.trans_result?.[0]?.dst
      ) {
        return response.data.data.result.trans_result[0].dst;
      }

      console.error('Translation failed:', response.message);
      return sanitizedCityName;
    } catch (error) {
      console.error('Failed to translate city name:', error);
      return cityName;
    }
  },

  async getWeatherByCity(city: string): Promise<WeatherData | null> {
    const language = i18n.language;
    try {
      // 先获取城市的地理信息
      const geoResponse = await apiClient<Location[]>({
        method: 'GET',
        url: 'https://api.openweathermap.org/geo/1.0/direct',
        zodSchema: LocationsSchema,
        queryParams: {
          q: city,
          limit: '1',
          appid: apiKey,
        },
      });

      if (
        geoResponse.success &&
        geoResponse.data &&
        geoResponse.data.length > 0
      ) {
        const cityInfo = geoResponse.data[0];
        // 获取当前语言的城市名，如果没有则使用默认名称
        const localName = cityInfo.local_names?.[language] || cityInfo.name;

        const response = await apiClient<WeatherData>({
          method: 'GET',
          url: `https://api.openweathermap.org/data/2.5/weather`,
          queryParams: {
            q: city,
            appid: apiKey,
            units: 'metric',
            lang: language,
          },
        });

        if (!response.success || !response.data) {
          return null;
        }

        // 使用本地化的城市名
        return {
          ...response.data,
          name: localName,
        };
      }

      // 如果获取地理信息失败，使用普通请求
      const response = await apiClient<WeatherData>({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather`,
        queryParams: {
          q: city,
          appid: apiKey,
          units: 'metric',
          lang: language,
        },
      });

      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return null;
    }
  },

  async getForecastByCity(city: string): Promise<Forecast | null> {
    const language = i18n.language;
    try {
      // 先获取城市的地理信息
      const geoResponse = await apiClient<Location[]>({
        method: 'GET',
        url: 'https://api.openweathermap.org/geo/1.0/direct',
        zodSchema: LocationsSchema,
        queryParams: {
          q: city,
          limit: '1',
          appid: apiKey,
        },
      });

      if (
        geoResponse.success &&
        geoResponse.data &&
        geoResponse.data.length > 0
      ) {
        const cityInfo = geoResponse.data[0];
        const localName = cityInfo.local_names?.[language] || cityInfo.name;

        const response = await apiClient<Forecast>({
          method: 'GET',
          url: `https://api.openweathermap.org/data/2.5/forecast`,
          zodSchema: ForecastSchema,
          queryParams: {
            q: city,
            appid: apiKey,
            units: 'metric',
            lang: language,
          },
        });

        if (!response.success || !response.data) {
          return null;
        }

        // 使用本地化的城市名
        return {
          ...response.data,
          city: {
            ...response.data.city,
            name: localName,
          },
        };
      }

      const response = await apiClient<Forecast>({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/forecast`,
        zodSchema: ForecastSchema,
        queryParams: {
          q: city,
          appid: apiKey,
          units: 'metric',
          lang: language,
        },
      });

      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Failed to fetch forecast data:', error);
      return null;
    }
  },

  async getCityNameFromCoords(
    lat: string,
    lon: string
  ): Promise<Location[] | null> {
    try {
      const response = await apiClient<Location[]>({
        method: 'GET',
        url: 'https://api.openweathermap.org/geo/1.0/reverse',
        zodSchema: LocationsSchema,
        queryParams: {
          lat: lat,
          lon: lon,
          limit: '1',
          appid: apiKey,
        },
      });

      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Failed to get city name from coordinates:', error);
      return null;
    }
  },
};
