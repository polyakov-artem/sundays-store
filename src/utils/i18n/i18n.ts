import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { CountryLocale } from '../../types/types';
import de from './locales/de/de.json';
import en from './locales/en/en.json';
import {
  DEFAULT_COUNTRY_CODE,
  getCountryCodeFromLS,
  getLocale,
} from '../../store/settingsSliceUtils';

const resources = {
  [CountryLocale.US]: {
    translation: en,
  },
  [CountryLocale.GB]: {
    translation: en,
  },
  [CountryLocale.DE]: {
    translation: de,
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: getLocale(getCountryCodeFromLS()),
  fallbackLng: getLocale(DEFAULT_COUNTRY_CODE),
  debug: true,
  saveMissing: true,

  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
