import { FC, memo } from 'react';
import { CountryLocale, TIntrinsicP } from '../../../types/types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import './ProductAvailability.scss';

export const PRODUCT_AVAILABILITY = 'product-availability';
export const PRODUCT_AVAILABILITY_VALUE = `${PRODUCT_AVAILABILITY}__value`;
export const PRODUCT_AVAILABILITY_NOT_AVAILABLE = `${PRODUCT_AVAILABILITY}_not-available`;

export type TProductAvailabilityProps = {
  isAvailable?: boolean;
  locale: CountryLocale;
} & TIntrinsicP;

const ProductAvailability: FC<TProductAvailabilityProps> = (props) => {
  const { className, isAvailable, locale, ...rest } = props;
  const { t } = useTranslation();

  const classes = classNames(PRODUCT_AVAILABILITY, className, {
    [PRODUCT_AVAILABILITY_NOT_AVAILABLE]: !isAvailable,
  });

  return (
    <p {...rest} className={classes}>
      {t(I18nKey.IsOnStock)}:{' '}
      <span
        className={
          PRODUCT_AVAILABILITY_VALUE
        }>{`${isAvailable ? t(I18nKey.Yes) : t(I18nKey.No)}`}</span>
    </p>
  );
};

export default memo(ProductAvailability);
