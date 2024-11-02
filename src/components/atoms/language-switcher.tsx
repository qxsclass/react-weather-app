import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import '@/styles/language-switcher.scss';

interface LanguageSwitcherProps {
  onLanguageChange: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  onLanguageChange,
}) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language');
      const browserLang = navigator.language.toLowerCase();
      const defaultLang = browserLang.startsWith('zh') ? 'zh' : 'en';
      const initialLang = savedLang || defaultLang;

      setCurrentLang(initialLang);
      i18n.changeLanguage(initialLang);
      localStorage.setItem('language', initialLang);
    }
  }, []);

  const handleLanguageChange = (language: string) => {
    setCurrentLang(language);
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    onLanguageChange(language);
  };

  return (
    <div className="language-switcher">
      <h1 className="logo">Weather</h1>
      <div className="language-buttons">
        <button
          className={`language-button ${currentLang === 'en' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('en')}
        >
          English
        </button>
        <button
          className={`language-button ${currentLang === 'zh' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('zh')}
        >
          中文
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
