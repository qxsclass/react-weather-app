import { AppProps } from 'next/app';
import { useEffect } from 'react';
import i18n from 'i18next';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const savedLng = localStorage.getItem('language');
    const browserLanguage = navigator.language || 'en'; // default
    i18n.changeLanguage(savedLng || browserLanguage.split('-')[0]);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
