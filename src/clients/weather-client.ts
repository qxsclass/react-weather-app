import { apiClient } from './base/api-client';
import { z } from 'zod';
import { getConfig } from '@/configs';

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
        lang: 'zh-cn',
      },
    });
  },
};
