import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { en } from '../src/locals/en';
import { es } from '../src/locals/es';
import { fr } from '../src/locals/fr';
import { de } from '../src/locals/de';
import { hi } from '../src/locals/hi';

i18n
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      hi: { translation: hi }
    },
    fallbackLng: 'en',
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'], // Check localStorage first, then browser language
      caches: ['localStorage'] // Cache language in localStorage
    }
  });

export default i18n;