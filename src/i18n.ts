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
      },
    },
  },
};

// 初始化 i18n
i18n.use(initReactI18next).init({
  resources,
  lng: 'zh', // 默认语言
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react 已经防止了 XSS
  },
});

const savedLng =
  typeof window !== 'undefined' ? localStorage.getItem('language') : 'zh';
i18n.init({
  lng: savedLng || 'zh',
});

export default i18n;
