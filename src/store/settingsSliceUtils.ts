import { localStorageService } from '../services/localStorageService';
import { CountryCode, CountryLocale } from '../types/types';

export const COUNTRY_CODE_LS_KEY = 'country_code';
export const DEFAULT_COUNTRY_CODE = CountryCode.US;

export const getLocale = (countryCode: CountryCode) => CountryLocale[countryCode];

export const getCountryCodeFromLS = () => {
  const countryCode = localStorageService.getData<string>(COUNTRY_CODE_LS_KEY);

  if (countryCode && countryCode in CountryCode) {
    return countryCode as CountryCode;
  }

  return DEFAULT_COUNTRY_CODE;
};
