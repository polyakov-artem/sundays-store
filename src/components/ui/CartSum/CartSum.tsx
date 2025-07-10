import { FC, useCallback, useMemo } from 'react';
import { TIntrinsicDiv, TExtCart, CurrencyChar } from '../../../types/types';
import classNames from 'classnames';
import { convertToNumber } from '../../../utils/getPriceData';
import { BLOCK, H2, H3 } from '../../../constants/cssHelpers';
import Button from '../../shared/Button/Button';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { AppStrings } from '../../../constants/appStrings';
import { useRemoveMyCartMutation } from '../../../store/userApi';
import { toast } from 'react-toastify';
import './CartSum.scss';

export const CART_SUM = 'cart-sum';
export const CART_SUM_LIST = `${CART_SUM}__list`;
export const CART_SUM_HEADER = `${CART_SUM}__header`;
export const CART_SUM_TITLE = `${CART_SUM}__title`;
export const CART_SUM_QUANTITY = `${CART_SUM}__quantity`;
export const CART_SUM_ITEM = `${CART_SUM}__item`;
export const CART_SUM_ITEM_NAME = `${CART_SUM}__item-name`;
export const CART_SUM_ITEM_VALUE = `${CART_SUM}__item-value`;
export const CART_SUM_ITEM_VALUE_DIFFERENCE = `${CART_SUM_ITEM_VALUE}_difference`;
export const CART_SUM_ITEM_VALUE_CURRENT = `${CART_SUM_ITEM_VALUE}_current`;
export const CART_SUM_ORDER_BTN = `${CART_SUM}__order-btn`;

const titleClasses = classNames(H2, CART_SUM_TITLE);
const differenceValueClasses = classNames(CART_SUM_ITEM_VALUE, CART_SUM_ITEM_VALUE_DIFFERENCE);
const currentValueClasses = classNames(H3, CART_SUM_ITEM_VALUE, CART_SUM_ITEM_VALUE_CURRENT);

export type TCartSumProps = {
  cart: TExtCart;
  isDisabled: boolean;
} & TIntrinsicDiv;

const CartSum: FC<TCartSumProps> = (props) => {
  const { className, cart, isDisabled, ...rest } = props;
  const classes = classNames(BLOCK, CART_SUM, className);
  const { totalPrice, lineItems, totalLineItemQuantity } = cart;
  const { currencyCode } = totalPrice;
  const [removeMyCartMutation] = useRemoveMyCartMutation();
  const locale = useAppSelector(selectLocale);
  const currencyChar = CurrencyChar[currencyCode];

  const totalPrices = useMemo(() => {
    const { fractionDigits, centAmount: currentTotalAmount } = totalPrice;
    let originalTotalAmount = 0;

    lineItems.forEach((item) => {
      const { variant, quantity } = item;
      const { priceData } = variant;
      const { originalAmount } = priceData;

      originalTotalAmount += originalAmount * quantity;
    });

    return {
      current: convertToNumber(currentTotalAmount, fractionDigits),
      original: convertToNumber(originalTotalAmount, fractionDigits),
      difference: convertToNumber(currentTotalAmount - originalTotalAmount, fractionDigits),
    };
  }, [lineItems, totalPrice]);

  const handleCreateOrder = useCallback(() => {
    void removeMyCartMutation().then(({ error }) => {
      if (error) {
        toast.error(localizedAppStrings[locale][AppStrings.SomethingWentWrong]);
      } else {
        toast.success(localizedAppStrings[locale][AppStrings.CompletedSuccessfully]);
      }
    });
  }, [locale, removeMyCartMutation]);

  return (
    <div className={classes} {...rest}>
      <div className={CART_SUM_HEADER}>
        <h2 className={titleClasses}>{localizedAppStrings[locale][AppStrings.YourCart]}</h2>
        <span className={CART_SUM_QUANTITY}>
          {totalLineItemQuantity}{' '}
          {totalLineItemQuantity! > 1
            ? localizedAppStrings[locale][AppStrings.items]
            : localizedAppStrings[locale][AppStrings.item]}
        </span>
      </div>
      <ul className={CART_SUM_LIST}>
        <li className={CART_SUM_ITEM}>
          <span className={CART_SUM_ITEM_NAME}>
            {localizedAppStrings[locale][AppStrings.OriginalPrice]}
          </span>
          <span className={CART_SUM_ITEM_VALUE}>
            {totalPrices.original} {currencyChar}
          </span>
        </li>
        {totalPrices.difference < 0 && (
          <li className={CART_SUM_ITEM}>
            <span className={CART_SUM_ITEM_NAME}>
              {localizedAppStrings[locale][AppStrings.Discount]}
            </span>
            <span className={differenceValueClasses}>
              {totalPrices.difference} {currencyChar}
            </span>
          </li>
        )}
        <li className={CART_SUM_ITEM}>
          <span className={CART_SUM_ITEM_NAME}>
            {localizedAppStrings[locale][AppStrings.Total]}
          </span>
          <span className={currentValueClasses}>
            {totalPrices.current} {currencyChar}
          </span>
        </li>
      </ul>

      <Button
        className={CART_SUM_ORDER_BTN}
        theme="primary"
        view="primary"
        el="button"
        type="submit"
        disabled={isDisabled}
        onClick={handleCreateOrder}
        text={localizedAppStrings[locale][AppStrings.CreateOrder]}
      />
    </div>
  );
};

export default CartSum;
