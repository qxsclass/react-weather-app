import fetch from 'node-fetch';
import { z } from 'zod';

const GeoCodingSchema = z.array(
  z.object({
    lat: z.number(),
    lon: z.number(),
    name: z.string(),
  })
);

async function geocodeCity(
  city: string
): Promise<{ lat: number; lon: number }> {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const result = GeoCodingSchema.parse(data);
  if (result.length === 0) {
    throw new Error('City not found');
  }
  return { lat: result[0].lat, lon: result[0].lon };
}
