// src/clients/weather-client.ts
import { apiClient } from './base/api-client';
import { z } from 'zod';

// 定义返回的天气数据的 Zod 模式
const WeatherInfoSchema = z.object({
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    pressure: z.number(),
    humidity: z.number(),
  }),
  weather: z.array(
    z.object({
      description: z.string(),
      icon: z.string(),
    })
  ),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
  }),
  name: z.string(),
});

export const weatherClient = {
  async getWeatherByCity(cityName: string) {
    return await apiClient({
      method: 'GET',
      url: 'api/weather',
      zodSchema: WeatherInfoSchema,
      queryParams: {
        q: cityName,
        units: 'metric',
        appid: process.env.OPENWEATHER_API_KEY ?? '',
      },
    });
  },
};
