// src/clients/weather-client.ts
import { apiClient } from './base/api-client';
import { z } from 'zod';

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

export const weatherClient = {
  async getWeatherByCity(city: string) {
    console.log(process.env.OPENWEATHER_API_KEY);
    return apiClient({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather`,
      zodSchema: WeatherSchema,
      queryParams: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY ?? 'aeb40a22f63323746108fcefb00c0f9b', // 你的 API 密钥
        units: 'metric', // 使用摄氏度
      },
    });
  },
};
