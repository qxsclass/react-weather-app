import { weatherClient } from '@/clients/weather-client';
import { Location, WeatherData } from '@/types/types';

export async function getGeosByCity(city: string): Promise<Location[] | null> {
  try {
    const response = await weatherClient.getWeatherByCity(city);
    if (!response) {
      return null;
    }

    const location: Location = {
      name: response.name,
      lat: response.coord.lat,
      lon: response.coord.lon,
      country: response.sys.country,
      state: undefined,
      local_names: undefined,
    };

    return [location];
  } catch (error) {
    console.error('Failed to get geos by city:', error);
    return null;
  }
}

export async function getCityNameFromCoords(
  lat: string,
  lon: string
): Promise<Location[] | null> {
  return weatherClient.getCityNameFromCoords(lat, lon);
}

export default getGeosByCity;
