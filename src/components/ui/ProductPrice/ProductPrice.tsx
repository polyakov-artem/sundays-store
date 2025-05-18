import { FC } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import { H3 } from '../../../constants/cssHelpers';
import './ProductPrice.scss';

export const PRODUCT_PRICE = 'product-price';
export const PRODUCT_PRICE_ACTUAL_PRICE = `${PRODUCT_PRICE}__actual-price`;
export const PRODUCT_PRICE_OLD_PRICE = `${PRODUCT_PRICE}__old-price`;
export const PRODUCT_PRICE_DISCOUNT_BLOCK = `${PRODUCT_PRICE}__discount-block`;
export const PRODUCT_PRICE_DISCOUNT_PRICE = `${PRODUCT_PRICE}__discount-price`;

export type TProductPriceProps = {
  originalPrice?: number;
  currentPrice?: number;
  discountDifference?: number;
  currencyChar?: string;
  isDiscounted?: boolean;
} & TIntrinsicDiv;

const ProductPrice: FC<TProductPriceProps> = (props) => {
  const {
    className,
    originalPrice,
    currentPrice,
    discountDifference,
    currencyChar,
    isDiscounted,
    ...rest
  } = props;

  const classes = classNames(PRODUCT_PRICE, className);

  let pricesContent;

  const actualPrice = (
    <p className={classNames(H3, PRODUCT_PRICE_ACTUAL_PRICE)}>
      {currentPrice} {currencyChar}
    </p>
  );

  if (isDiscounted) {
    pricesContent = (
      <>
        <div className={PRODUCT_PRICE_DISCOUNT_BLOCK}>
          <span className={PRODUCT_PRICE_OLD_PRICE}>
            {originalPrice} {currencyChar}
          </span>
          <span className={PRODUCT_PRICE_DISCOUNT_PRICE}>
            -{discountDifference} {currencyChar}
          </span>
        </div>
        {actualPrice}
      </>
    );
  } else {
    pricesContent = actualPrice;
  }

  return (
    <div className={classes} {...rest}>
      {pricesContent}
    </div>
  );
};

export default ProductPrice;
