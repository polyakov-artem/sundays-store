import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  CountryCurrency,
  TCart,
  TIntrinsicDiv,
  TLineItem,
  TUpdateCartAction,
} from '../../../types/types';
import Button from '../../shared/Button/Button';
import { FaShoppingCart } from 'react-icons/fa';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { useAppDispatch, useAppSelector } from '../../../hooks/store-hooks';
import { selectCountryCode, selectLocale } from '../../../store/settingsSlice';
import { AppStrings } from '../../../constants/appStrings';
import Counter from '../../shared/Counter/Counter';
import ScreenLoader from '../../shared/ScreenLoader/ScreenLoader';
import {
  useCreateMyCartMutation,
  useLazyGetMyActiveCartQuery,
  useUpdateMyCartMutation,
} from '../../../store/storeApi';
import { TokenRole } from '../../../services/authService';
import { getAnonymousToken, selectUserRole } from '../../../store/authSlice';
import { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import {
  createAddLineItemAction,
  createRemoveLineItemAction,
} from '../../../utils/cartUpdateActionCreators';
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
  const locale = useAppSelector(selectLocale);
  const classes = classNames(PURCHASE_BUTTONS, className);
  const [count, setCount] = useState(0);
  const dispatch = useAppDispatch();

  const [isUpdatingCount, setIsUpdatingCount] = useState(false);
  const role = useAppSelector(selectUserRole);
  const countryCode = useAppSelector(selectCountryCode);
  const currency = CountryCurrency[countryCode];

  const [getMyActiveCart] = useLazyGetMyActiveCartQuery();
  const [createMyCart] = useCreateMyCartMutation();
  const [updateMyCart] = useUpdateMyCartMutation();

  const handleCartError = useCallback(() => {
    toast.error(ERROR_FAILED_TO_UPDATE_CART);
    setIsUpdatingCount(false);
  }, []);

  const getOrCreateActiveCart = useCallback(async (): Promise<TCart | undefined> => {
    if (role === TokenRole.basic) {
      try {
        await dispatch(getAnonymousToken());
      } catch {
        // ignore
      }
    }

    const { error: activeCartQueryError, data: activeCartQueryData } = await getMyActiveCart();

    if (!activeCartQueryError && activeCartQueryData) {
      return activeCartQueryData;
    }

    if (
      activeCartQueryError &&
      'status' in activeCartQueryError &&
      activeCartQueryError?.status === HttpStatusCode.NotFound
    ) {
      const { data: createCartQueryData, error: createCartError } = await createMyCart({
        currency,
        country: countryCode,
      });

      if (!createCartError && createCartQueryData) {
        return createCartQueryData;
      }
    }

    return undefined;
  }, [countryCode, createMyCart, currency, dispatch, getMyActiveCart, role]);

  const createUpdateAction = useCallback(
    (activeCart: TCart, newCount: number): TUpdateCartAction | undefined => {
      const cartLineItem = findLineItem(productId, variantId, activeCart.lineItems);

      if (!cartLineItem) {
        if (newCount > 0) {
          return createAddLineItemAction(productId, variantId, newCount);
        }
        return undefined;
      }

      const { quantity, id: lineItemId } = cartLineItem;
      const quantityDiff = newCount - quantity;

      if (quantityDiff > 0) {
        return createAddLineItemAction(productId, variantId, quantityDiff);
      } else if (quantityDiff < 0) {
        return createRemoveLineItemAction(lineItemId, -quantityDiff);
      }

      return undefined;
    },
    [productId, variantId]
  );

  const handleCountChange = useCallback(
    async (newCount: number) => {
      setIsUpdatingCount(true);

      const activeCart = await getOrCreateActiveCart();

      if (!activeCart) {
        handleCartError();
        return;
      }

      const action = createUpdateAction(activeCart, newCount);

      if (!action) {
        setIsUpdatingCount(false);
        return;
      }

      const updateMyCartResponse = await updateMyCart({
        cartId: activeCart.id,
        data: {
          version: activeCart.version,
          actions: [action],
        },
      });

      if (updateMyCartResponse.error) {
        handleCartError();
        return;
      }

      setCount(newCount);
      setIsUpdatingCount(false);
    },
    [createUpdateAction, getOrCreateActiveCart, handleCartError, updateMyCart]
  );

  useEffect(() => {
    const getInitialCount = async () => {
      setIsUpdatingCount(true);

      const { error: activeCartQueryError, data: activeCartQueryData } = await getMyActiveCart();

      if (!activeCartQueryError && activeCartQueryData) {
        const initialCount = findLineItem(
          productId,
          variantId,
          activeCartQueryData.lineItems
        )?.quantity;

        if (initialCount) {
          setCount(initialCount);
        }
      }

      setIsUpdatingCount(false);
    };

    if (role !== TokenRole.basic) {
      void getInitialCount();
    }
  }, [getMyActiveCart, productId, variantId, role]);

  const handleAddToCartBtnClick = useCallback(() => {
    if (disabled) {
      return;
    }
    void handleCountChange(1);
  }, [disabled, handleCountChange]);

  let purchaseButtonContent;

  if (!count) {
    purchaseButtonContent = (
      <Button
        el="button"
        view="primary"
        theme="primary"
        icon={isUpdatingCount ? <ScreenLoader type="round" theme="white" /> : <FaShoppingCart />}
        text={localizedAppStrings[locale][AppStrings.AddToCart]}
        size="sm"
        iconBefore
        className={PURCHASE_BUTTONS_ADD_BTN}
        onClick={handleAddToCartBtnClick}
        disabled={disabled || isUpdatingCount}
      />
    );
  } else {
    purchaseButtonContent = (
      <Counter
        count={count}
        onCountChange={handleCountChange}
        max={99}
        min={0}
        disabled={disabled || isUpdatingCount}
        isLoading={isUpdatingCount}
      />
    );
  }

  return (
    <div {...rest} className={classes}>
      {purchaseButtonContent}
    </div>
  );
};

export default PurchaseButtons;
