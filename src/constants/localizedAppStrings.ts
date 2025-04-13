import { CountryLocale, TLocalizedString } from '../types/types';

export enum AppStrings {
  Catalog = 'Catalog',
}

export const dictionary: Record<string, Partial<TLocalizedString>> = {
  catalog: {
    [CountryLocale.DE]: 'katalog',
  },
};

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
