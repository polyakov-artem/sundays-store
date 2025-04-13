import { CountryLocale, TLocalizedString } from '../types/types';

export const localizeString = (locale: CountryLocale, str: string) => {
  const result = dictionary[str.toLocaleLowerCase()][locale];
  if (!result) return str;

  if (str.toUpperCase() === str) {
    return result.toUpperCase();
  }

  if (str[0].toUpperCase() === str[0]) {
    return result[0].toUpperCase() + result.slice(1);
  }

  return result;
};

export const dictionary: Record<string, Partial<TLocalizedString>> = {
  catalog: {
    [CountryLocale.DE]: 'katalog',
  },
};
