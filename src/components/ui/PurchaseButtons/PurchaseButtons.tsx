import classNames from 'classnames';
import { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { CountryCurrency, TIntrinsicDiv, TLineItem } from '../../../types/types';
import Button from '../../shared/Button/Button';
import { FaShoppingCart } from 'react-icons/fa';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectCountryCode } from '../../../store/settingsSlice';
import Counter from '../../shared/Counter/Counter';
import ScreenLoader from '../../shared/ScreenLoader/ScreenLoader';
import {
  useChangeItemsQuantityInCartMutation,
  useLazyGetMyActiveCartQuery,
} from '../../../store/userApi';
import { selectIsUpdatingCart, selectUserRole } from '../../../store/userSlice';
import { toast } from 'react-toastify';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import { useTranslation } from 'react-i18next';
import './PurchaseButtons.scss';

export const PURCHASE_BUTTONS = 'purchase-buttons';
export const PURCHASE_BUTTONS_ADD_BTN = `${PURCHASE_BUTTONS}__add-btn`;

export type TPurchaseButtonsProps = {
  productId: string;
  variantId: number;
  disabled?: boolean;
} & TIntrinsicDiv;

export const ERROR_FAILED_TO_UPDATE_CART = 'Failed to update cart. Please try to reload the page.';

const findLineItem = (productId: string, variantId: number, lineItems?: TLineItem[]) =>
  lineItems?.find((item) => item.productId === productId && item.variant.id === variantId);

const PurchaseButtons: FC<TPurchaseButtonsProps> = (props) => {
  const { className, disabled, variantId, productId, ...rest } = props;
  const classes = classNames(PURCHASE_BUTTONS, className);
  const { t } = useTranslation();

  const role = useAppSelector(selectUserRole);
  const country = useAppSelector(selectCountryCode);
  const currency = CountryCurrency[country];
  const isUpdatingCart = useAppSelector(selectIsUpdatingCart);
  const [getMyActiveCart, { data: activeCart }] = useLazyGetMyActiveCartQuery();
  const [changeItemsQuantityInCart] = useChangeItemsQuantityInCartMutation();
  const isDisabled = isUpdatingCart || disabled;

  const count = useMemo(() => {
    return findLineItem(productId, variantId, activeCart?.lineItems)?.quantity || 0;
  }, [activeCart, productId, variantId]);

  const handleCountChange = useCallback(
    async (newCount: number) => {
      if (isDisabled) {
        return;
      }

      const changeItemsQuantityInCartResult = await changeItemsQuantityInCart({
        cartDraft: { currency, country },
        changedQuantityItems: [{ productId, variantId, nextQuantity: newCount }],
      });

      if (changeItemsQuantityInCartResult.error) {
        toast.error(ERROR_FAILED_TO_UPDATE_CART);
        return;
      }
    },
    [changeItemsQuantityInCart, country, currency, isDisabled, productId, variantId]
  );

  useEffect(() => {
    void getMyActiveCart();
  }, [getMyActiveCart, role]);

  const handleAddToCartBtnClick = useCallback(() => {
    if (isDisabled) {
      return;
    }

    void handleCountChange(1);
  }, [isDisabled, handleCountChange]);

  let purchaseButtonContent;

  if (!count) {
    purchaseButtonContent = (
      <Button
        el="button"
        view="primary"
        theme="primary"
        icon={isUpdatingCart ? <ScreenLoader type="round" theme="white" /> : <FaShoppingCart />}
        text={t(I18nKey.AddToCart)}
        size="sm"
        iconBefore
        className={PURCHASE_BUTTONS_ADD_BTN}
        onClick={handleAddToCartBtnClick}
        disabled={isDisabled}
      />
    );
  } else {
    purchaseButtonContent = (
      <Counter
        count={count}
        onCountChange={handleCountChange}
        max={99}
        min={0}
        disabled={isDisabled}
        isLoading={isUpdatingCart}
      />
    );
  }

  return (
    <div {...rest} className={classes}>
      {purchaseButtonContent}
    </div>
  );
};

export default memo(PurchaseButtons);
