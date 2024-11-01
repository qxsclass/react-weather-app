import axios from 'axios';
import { weatherClient } from '@/clients/weather-client';

// Define a type for the expected response structure for better type safety
type GeoLocation = {
  lat: number;
  lon: number;
};

export default async function getLatLonByCity(
  city: string
): Promise<GeoLocation | undefined> {
  // geo code
  // const geoResponse = axios.get(
  //   `http://api.openweathermap.org/geo/1.0/direct`,
  //   {
  //     params: {
  //       q: city,
  //       limit: 1,
  //       appid: process.env.OPENWEATHER_API_KEY,
  //     },
  //   }
  // );
  console.log('accept city name:', city);
  try {
    // Assuming getGeosByCity is an async function returning a promise
    const geoResponse = await weatherClient.getGeosByCity(city);
    if (geoResponse.length > 0) {
      const location = geoResponse[0];
      console.log('Location found:', location);
      return {
        lat: location.lat,
        lon: location.lon,
      };
    } else {
      console.log('No location found for the given city.');
      return undefined;
    }
  } catch (e) {
    console.error('Failed to fetch geolocation:', e);
  }
  return undefined; // Return undefined if there is an error or no data
}
