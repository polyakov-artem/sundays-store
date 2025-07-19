import classNames from 'classnames';
import { TIntrinsicLi, TExtLineItem } from '../../../types/types';
import { ChangeEventHandler, FC, memo, MouseEventHandler, useMemo } from 'react';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import ProductPrice from '../ProductPrice/ProductPrice';
import PurchaseButtons from '../PurchaseButtons/PurchaseButtons';
import { H4, MEDIA_CONTAIN } from '../../../constants/cssHelpers';
import Button from '../../shared/Button/Button';
import { FaRegTrashAlt } from 'react-icons/fa';
import Checkbox from '../../shared/Checkbox/Checkbox';
import { convertToNumber, getAmount } from '../../../utils/getPriceData';
import './CartItem.scss';

export const CART_ITEM = 'cart-item';
export const CART_ITEM_IMG_WRAP = `${CART_ITEM}__img-wrap`;
export const CART_ITEM_TITLE_WRAP = `${CART_ITEM}__title-wrap`;
export const CART_ITEM_TITLE = `${CART_ITEM}__title`;
export const CART_ITEM_ACTIONS = `${CART_ITEM}__actions`;
export const CART_ITEM_BODY = `${CART_ITEM}__body`;
export const CART_ITEM_FOOTER = `${CART_ITEM}__footer`;
export const CART_ITEM_PRICE = `${CART_ITEM}__price`;

export type TCartItemProps = {
  item: TExtLineItem;
  isSelected: boolean;
  isDisabled: boolean;
  onItemSelect: ChangeEventHandler<HTMLInputElement>;
  onItemRemove: MouseEventHandler<HTMLButtonElement>;
} & TIntrinsicLi;

const CartItem: FC<TCartItemProps> = (props) => {
  const {
    className,
    item,
    isSelected,
    isDisabled,
    onItemSelect,
    onItemRemove,

    ...rest
  } = props;
  const classes = classNames(CART_ITEM, className);
  const titleClasses = classNames(H4, CART_ITEM_TITLE);
  const locale = useAppSelector(selectLocale);
  const { name, variant, productId, quantity, totalPrice } = item;
  const { priceData, id: variantId, images } = variant;
  const localizedName = name[locale];

  const { originalAmount, amountDifference, currencyChar, isDiscounted, fractionDigits } =
    priceData;

  const totalPrices = useMemo(() => {
    return {
      currentPrice: convertToNumber(getAmount(totalPrice), fractionDigits),
      priceDifference: convertToNumber(amountDifference * quantity, fractionDigits),
      originalPrice: convertToNumber(originalAmount * quantity, fractionDigits),
    };
  }, [amountDifference, fractionDigits, originalAmount, quantity, totalPrice]);

  return (
    <li className={classes} {...rest}>
      <div className={CART_ITEM_BODY}>
        <Checkbox
          view="primary"
          theme="secondary"
          controlProps={{
            value: item.id,
            onChange: onItemSelect,
            checked: isSelected,
            disabled: isDisabled,
          }}
        />
        <div className={CART_ITEM_IMG_WRAP}>
          <img src={images?.[0].url} alt={localizedName} className={MEDIA_CONTAIN} />
        </div>
        <div className={CART_ITEM_TITLE_WRAP}>
          <h4 className={titleClasses}>{localizedName}</h4>
          <div className={CART_ITEM_ACTIONS}>
            <Button
              disabled={isDisabled}
              value={item.id}
              size="sm"
              type="button"
              el="button"
              theme="secondary"
              view="icon"
              icon={<FaRegTrashAlt />}
              onClick={onItemRemove}
            />
          </div>
        </div>
      </div>
      <div className={CART_ITEM_FOOTER}>
        <PurchaseButtons productId={productId} variantId={variantId} />
        <ProductPrice
          className={CART_ITEM_PRICE}
          originalPrice={totalPrices.originalPrice}
          currentPrice={totalPrices.currentPrice}
          priceDifference={totalPrices.priceDifference}
          currencyChar={currencyChar}
          isDiscounted={isDiscounted}
        />
      </div>
    </li>
  );
};

export default memo(CartItem);
