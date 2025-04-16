import { CountryLocale } from '../types/types';
import { AppStrings } from './appStrings';
import { dictionary } from './dictionary';

export const localizeString = (locale: CountryLocale, str: string) => {
  const result = dictionary[str][locale];
  return result ? result : str;
};

export const localizedAppStrings = Object.values(CountryLocale).reduce(
  (result, locale) => {
    const words = Object.values(AppStrings).reduce(
      (result, str) => {
        const localizedString = localizeString(locale, str);
        result[str] = localizedString;
        return result;
      },
      {} as Record<AppStrings, string>
    );
    result[locale] = words;
    return result;
  },
  {} as Record<CountryLocale, Record<AppStrings, string>>
);
