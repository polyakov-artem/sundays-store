import { FC } from 'react';
import { CountryLocale, TIntrinsicP } from '../../../types/types';
import classNames from 'classnames';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
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

  const classes = classNames(PRODUCT_AVAILABILITY, className, {
    [PRODUCT_AVAILABILITY_NOT_AVAILABLE]: !isAvailable,
  });

  return (
    <p {...rest} className={classes}>
      {localizedAppStrings[locale][AppStrings.IsOnStock]}:{' '}
      <span
        className={
          PRODUCT_AVAILABILITY_VALUE
        }>{`${isAvailable ? localizedAppStrings[locale][AppStrings.Yes] : localizedAppStrings[locale][AppStrings.No]}`}</span>
    </p>
  );
};

export default ProductAvailability;
