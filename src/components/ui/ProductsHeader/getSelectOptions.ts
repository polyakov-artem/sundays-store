import { TFunction } from 'i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import { TSelectOptions } from '../../shared/Select/Select';

export const DEFAULT_VALUE = '';
export const PRICE_ASC = 'price_asc';
export const PRICE_DESC = 'price_desc';
export const NAME_DESC = 'name_desc';
export const NAME_ASC = 'name_asc';

export const getSelectOptions = (t: TFunction<'translation', undefined>): TSelectOptions => [
  {
    label: t(I18nKey.Default),
    value: DEFAULT_VALUE,
  },
  {
    label: t(I18nKey.PriceAscending),
    value: PRICE_ASC,
  },
  {
    label: t(I18nKey.PriceDescending),
    value: PRICE_DESC,
  },
  {
    label: t(I18nKey.NameAlphabetical),
    value: NAME_ASC,
  },
  {
    label: t(I18nKey.NameInReverseOrder),
    value: NAME_DESC,
  },
];
