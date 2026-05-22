'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');

    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lang: 'uk' | 'en') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="flex overflow-hidden rounded-md border border-black text-sm">
      <button
        onClick={() => changeLanguage('uk')}
        className={`px-4 py-2 transition-colors ${
          i18n.language === 'uk'
            ? 'font-semibold text-black'
            : 'text-gray-400 hover:text-black focus:text-black'
        }`}
      >
        UA
      </button>

      <span className="flex items-center text-gray-300">|</span>

      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-2 transition-colors ${
          i18n.language === 'en'
            ? 'font-semibold text-black'
            : 'text-gray-400 hover:text-black focus:text-black'
        }`}
      >
        EN
      </button>
    </div>
  );
}
