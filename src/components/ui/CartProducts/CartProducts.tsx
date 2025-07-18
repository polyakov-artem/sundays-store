import { ChangeEvent, FC, memo, useCallback, useId, useMemo, useState } from 'react';
import {
  TIntrinsicDiv,
  TExtLineItem,
  CountryCurrency,
  TChangedQuantityItem,
} from '../../../types/types';
import classNames from 'classnames';
import CartItem from '../CartItem/CartItem';
import { BLOCK } from '../../../constants/cssHelpers';
import CheckboxField from '../../shared/CheckboxField/CheckboxField';
import { createNormalizedData } from '../../../utils/createNormalizedData';
import Button from '../../shared/Button/Button';
import { useAppSelector } from '../../../hooks/store-hooks';
import { useChangeItemsQuantityInCartMutation } from '../../../store/userApi';
import { selectCountryCode } from '../../../store/settingsSlice';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import './CartProducts.scss';

export const CART_PRODUCTS = 'cart-products';
export const CART_PRODUCTS_HEADER = `${CART_PRODUCTS}__header`;
export const CART_PRODUCTS_LIST = `${CART_PRODUCTS}__list`;
export const CART_PRODUCTS_ITEM = `${CART_PRODUCTS}__item`;
export const CART_PRODUCTS_SELECT_ALL = `${CART_PRODUCTS}__select-all`;

export const ZERO_QUANTITY = 0;

export type TCartProductsProps = {
  items: TExtLineItem[];
  isDisabled: boolean;
} & TIntrinsicDiv;

const getChangedQuantityItem = (
  itemsMap: Record<string, TExtLineItem>,
  lineItemId: string,
  nextQuantity: number
) => {
  const item = itemsMap[lineItemId];

  if (!item) {
    return;
  }

  return { productId: item.productId, variantId: item.variant.id, nextQuantity };
};

const CartProducts: FC<TCartProductsProps> = (props) => {
  const { className, items, isDisabled, ...rest } = props;
  const classes = classNames(CART_PRODUCTS, className);
  const listClasses = classNames(BLOCK, CART_PRODUCTS_LIST);
  const headerClasses = classNames(BLOCK, CART_PRODUCTS_HEADER);
  const [selectedItemsIds, setSelectedItemsIds] = useState<string[]>([]);
  const selectAllCheckboxId = useId();
  const normalizedItems = useMemo(() => createNormalizedData(items, 'id'), [items]);
  const country = useAppSelector(selectCountryCode);
  const currency = CountryCurrency[country];
  const { t } = useTranslation();
  const [changeItemsQuantityInCart] = useChangeItemsQuantityInCartMutation();

  const areAllChecked = useMemo(
    () => items.every((item) => selectedItemsIds.includes(item.id)),
    [items, selectedItemsIds]
  );

  const handleSelectAll = useCallback(() => {
    setSelectedItemsIds(() => {
      if (areAllChecked) {
        return [];
      }

      return normalizedItems.ids;
    });
  }, [areAllChecked, normalizedItems.ids]);

  const handleRemoveItemBtnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        return;
      }

      const changedQuantityItem = getChangedQuantityItem(
        normalizedItems.entities,
        e.currentTarget.value,
        ZERO_QUANTITY
      );

      if (changedQuantityItem) {
        void changeItemsQuantityInCart({
          cartDraft: { currency, country },
          changedQuantityItems: [changedQuantityItem],
        });
      }
    },
    [changeItemsQuantityInCart, country, currency, isDisabled, normalizedItems.entities]
  );

  const handleDeleteItemsBtnClick = useCallback(() => {
    if (isDisabled) {
      return;
    }

    const changedQuantityItems: TChangedQuantityItem[] = [];

    selectedItemsIds.forEach((id) => {
      const changedQuantityItem = getChangedQuantityItem(
        normalizedItems.entities,
        id,
        ZERO_QUANTITY
      );

      if (changedQuantityItem) {
        changedQuantityItems.push(changedQuantityItem);
      }

      if (changedQuantityItems.length) {
        void changeItemsQuantityInCart({
          cartDraft: { currency, country },
          changedQuantityItems,
        });
      }
    });
  }, [
    changeItemsQuantityInCart,
    country,
    currency,
    isDisabled,
    normalizedItems.entities,
    selectedItemsIds,
  ]);

  const handleItemSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSelectedItemsIds((prevState) => {
      const id = e.target.value;
      const idIndex = prevState.indexOf(id);
      const nextState = [...prevState];

      if (idIndex === -1) {
        nextState.push(id);
      } else {
        nextState.splice(idIndex, 1);
      }
      return nextState;
    });
  }, []);

  const cartItems = useMemo(() => {
    return items.map((item) => (
      <CartItem
        className={CART_PRODUCTS_ITEM}
        key={item.id}
        item={item}
        isSelected={selectedItemsIds.includes(item.id)}
        onItemSelect={handleItemSelect}
        onItemRemove={handleRemoveItemBtnClick}
        isDisabled={isDisabled}
      />
    ));
  }, [handleItemSelect, handleRemoveItemBtnClick, isDisabled, items, selectedItemsIds]);

  return (
    <div className={classes} {...rest}>
      <div className={headerClasses}>
        <CheckboxField
          className={CART_PRODUCTS_SELECT_ALL}
          labelContent={t(I18nKey.SelectAll)}
          checkboxProps={{
            view: 'primary',
            theme: 'secondary',
            controlProps: {
              checked: areAllChecked,
              onChange: handleSelectAll,
              id: selectAllCheckboxId,
            },
          }}
        />
        <Button
          disabled={isDisabled}
          size="sm"
          theme="primary"
          view="primary"
          el="button"
          onClick={handleDeleteItemsBtnClick}>
          {t(I18nKey.DeleteSelected)}
        </Button>
      </div>
      <ul className={listClasses}>{cartItems}</ul>
    </div>
  );
};

export default memo(CartProducts);
