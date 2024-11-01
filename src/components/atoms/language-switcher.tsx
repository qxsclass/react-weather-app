import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import '@/styles/language-switcher.scss';

interface LanguageSwitcherProps {
  onLanguageChange: (language: string) => void;
}
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  onLanguageChange,
}) => {
  const { i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setActiveLanguage(lng); // 设置激活状态
    localStorage.setItem('language', lng);
    if (onLanguageChange) {
      onLanguageChange(lng);
    }
  };

  return (
    <div className="language-switcher">
      <h3 className="logo">Weather</h3>
      <div className="language-buttons">
        <button
          onClick={() => changeLanguage('en')}
          className={`language-button ${activeLanguage === 'en' ? 'active' : ''}`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('zh')}
          className={`language-button ${activeLanguage === 'zh' ? 'active' : ''}`}
        >
          中文
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
