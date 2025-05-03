import { AppStrings } from '../../../constants/appStrings';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { CountryLocale } from '../../../types/types';
import { TSelectOptions } from '../../shared/Select/Select';

export const DEFAULT_VALUE = '';
export const PRICE_ASC = 'price_asc';
export const PRICE_DESC = 'price_desc';
export const NAME_DESC = 'name_desc';
export const NAME_ASC = 'name_asc';

export const getSelectOptions = (locale: CountryLocale): TSelectOptions => [
  {
    label: localizedAppStrings[locale][AppStrings.Default],
    value: DEFAULT_VALUE,
  },
  {
    label: localizedAppStrings[locale][AppStrings.PriceAscending],
    value: PRICE_ASC,
  },
  {
    label: localizedAppStrings[locale][AppStrings.PriceDescending],
    value: PRICE_DESC,
  },
  {
    label: localizedAppStrings[locale][AppStrings.NameAlphabetical],
    value: NAME_ASC,
  },
  {
    label: localizedAppStrings[locale][AppStrings.NameInReverseOrder],
    value: NAME_DESC,
  },
];

export const selectValues = getSelectOptions(CountryLocale.US).map((item) => item.value);
