// pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { ZodSchema, z } from 'zod';

// 定义天气信息的 Zod 模式
const WeatherSchema = z.object({
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
  name: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const city = req.query.city as string;
    console.log('accept city name:', city);
    try {
      // 获取地理编码
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct`,
        {
          params: {
            q: city,
            limit: 1,
            appid: process.env.OPENWEATHER_API_KEY,
          },
        }
      );

      const location = geoResponse.data[0];
      const lat = location.lat;
      const lon = location.lon;

      // 获取天气信息
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: lat,
            lon: lon,
            appid: process.env.OPENWEATHER_API_KEY,
          },
        }
      );

      const weatherData = WeatherSchema.parse(weatherResponse.data);
      res.status(200).json(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
