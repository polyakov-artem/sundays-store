import { useMemo } from 'react';
import { CountryLocale } from '../types/types';
import { localizeString } from '../utils/localizeString';

export const useLocalizedStringArray = (locale: CountryLocale, ...stringArray: string[]) => {
  const localizedStringArray = useMemo(
    () => stringArray.map((str) => localizeString(locale, str)),
    [locale, stringArray]
  );
  return localizedStringArray;
};
