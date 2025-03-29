import { CountryCode } from '../types/types';

export const getLocale = (countryCode: CountryCode) => {
  const languages = {
    GB: 'en',
    US: 'en',
    DE: 'de',
  };

  return `${languages[countryCode]}-${countryCode}`;
};
