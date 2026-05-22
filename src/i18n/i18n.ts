'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import uk from './locales/uk.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },

    uk: {
      translation: uk,
    },
  },

  lng: 'uk',
  fallbackLng: 'uk',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
