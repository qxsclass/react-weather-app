// pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { z } from 'zod';
import getLatLonByCity from '@/utils/dealGeoInfo';

// Define Zod schema for the weather API response validation
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
      const geos = getLatLonByCity(city);
      console.log('accept geos:', geos);
      // 获取天气信息
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: geos?.lat,
            lon: geos?.lon,
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
