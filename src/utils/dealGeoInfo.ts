import axios from 'axios';
import { weatherClient } from '@/clients/weather-client';

export default function getLatLonByCity(city: string) {
  console.log('accept city name:', city);
  try {
    // 获取地理编码
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

    const geoResponse = weatherClient.getGeosByCity(city);

    const location = geoResponse.data[0];
    console.log('location:', location);
    return {
      lat: location.lat,
      lon: location.lon,
    };
  } catch (e) {
    console.error(e);
  }
}
