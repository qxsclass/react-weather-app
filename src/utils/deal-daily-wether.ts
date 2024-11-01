import { WeatherPoint, DayForecast } from '@/types/types';

type WeatherData = {
  dt: number; // Unix timestamp
  main: {
    temp: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
  }>;
};

export const groupByDay = (list: WeatherPoint[]) => {
  const groupedByDay: Record<string, WeatherPoint[]> = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('zh-CN');
    if (!groupedByDay[date]) {
      groupedByDay[date] = [];
    }
    groupedByDay[date].push(item);
  });
  return groupedByDay;
};

export const calculateDailyAverages = (
  groupedData: Record<string, WeatherPoint[]>
): DayForecast[] => {
  return Object.keys(groupedData).map((date) => {
    const dayData = groupedData[date];
    if (!dayData.length) {
      return {
        date: 'N/A',
        weekday: 'N/A',
        averageTemp: null,
        averageFeelsLike: null,
        maxTemp: null,
        minTemp: null,
        condition: 'No data',
      };
    }

    const temps = dayData.map((item) => item.main.temp);
    const feelsLike = dayData.map((item) => item.main.feels_like);

    const averageTemp =
      temps.length > 0
        ? Number(
            (temps.reduce((acc, curr) => acc + curr, 0) / temps.length).toFixed(
              1
            )
          )
        : null;

    const averageFeelsLike =
      feelsLike.length > 0
        ? Number(
            (
              feelsLike.reduce((acc, curr) => acc + curr, 0) / feelsLike.length
            ).toFixed(1)
          )
        : null;

    const maxTemp =
      temps.length > 0 ? Number(Math.max(...temps).toFixed(1)) : null;
    const minTemp =
      temps.length > 0 ? Number(Math.min(...temps).toFixed(1)) : null;

    const weatherConditions = dayData.reduce(
      (acc, curr) => {
        const condition = curr.weather[0]?.main;
        if (condition) {
          acc[condition] = (acc[condition] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const mostFrequentCondition = Object.keys(weatherConditions).reduce(
      (a, b) => (weatherConditions[a] > weatherConditions[b] ? a : b)
    );

    const dateObj = new Date(date);
    return {
      date: dateObj.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      weekday: dateObj.toLocaleDateString('zh-CN', { weekday: 'short' }),
      averageTemp,
      averageFeelsLike,
      maxTemp,
      minTemp,
      condition: mostFrequentCondition,
    };
  });
};
