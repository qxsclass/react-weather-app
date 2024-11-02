import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 定义语言资源
const resources = {
  en: {
    translation: {
      cityPlaceholder: 'Enter city name',
      getWeather: 'Get Weather',
      loading: 'Loading...',
      hourlyWeatherTitle: 'Hourly Weather Today',
      forecastTitle: 'Weather Forecast for the Coming Days',
      days: {
        Sat: 'Sat',
        Sun: 'Sun',
        Mon: 'Mon',
        Tue: 'Tue',
        Wed: 'Wed',
        Thu: 'Thu',
        Fri: 'Fri',
      },
      weather: {
        title: 'Weather in {{city}}',
        temperature: 'Temperature: {{temp}}°C',
        feelsLike: 'Feels Like: {{feelsLike}}°C',
        humidity: 'Humidity: {{humidity}}%',
        description: 'Description: {{description}}',
      },
      error: {
        locationDenied: 'Location permission denied',
        locationUnavailable: 'Location information is unavailable',
        timeout: 'The request to get user location timed out',
        unknownError: 'An unknown error occurred',
        cityNotFound: 'city not found',
        translationFailed: 'Failed to translate city name',
        generalError: 'Failed to fetch weather data',
        cityNameTooShort: 'City name must be at least 3 characters',
        noCityProvided: 'Please enter a city name',
      },
    },
  },
  zh: {
    translation: {
      cityPlaceholder: '输入城市名称',
      getWeather: '获取天气',
      loading: '加载中...',
      hourlyWeatherTitle: '今日小时天气',
      forecastTitle: '未来几天的天气预报',
      days: {
        Sat: '周六',
        Sun: '周日',
        Mon: '周一',
        Tue: '周二',
        Wed: '周三',
        Thu: '周四',
        Fri: '周五',
      },
      weather: {
        title: '当前城市天气：{{city}}',
        temperature: '温度：{{temp}}°C',
        feelsLike: '体感温度：{{feelsLike}}°C',
        humidity: '湿度：{{humidity}}%',
        description: '描述：{{description}}',
      },
      error: {
        locationDenied: '位置权限被拒绝',
        locationUnavailable: '无法获取位置信息',
        timeout: '请求获取用户位置超时',
        unknownError: '发生未知错误',
        cityNotFound: 'city not found',
        translationFailed: '城市名称翻译失败',
        generalError: '获取天气数据失败',
        cityNameTooShort: '城市名称至少需要3个字符',
        noCityProvided: '请输入城市名称',
      },
    },
  },
};

// 初始化 i18n
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // 默认语言
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
