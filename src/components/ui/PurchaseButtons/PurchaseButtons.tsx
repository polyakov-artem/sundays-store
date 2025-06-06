import classNames from 'classnames';
import { FC, useCallback, useEffect, useState, useRef } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import Button from '../../shared/Button/Button';
import { FaShoppingCart } from 'react-icons/fa';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { AppStrings } from '../../../constants/appStrings';
import Counter from '../../shared/Counter/Counter';
import ScreenLoader from '../../shared/ScreenLoader/ScreenLoader';
import { delay } from 'msw';
import './PurchaseButtons.scss';

export const PURCHASE_BUTTONS = 'purchase-buttons';
export const PURCHASE_BUTTONS_ADD_BTN = `${PURCHASE_BUTTONS}__add-btn`;
export const PURCHASE_BUTTONS_SPINNER = `${PURCHASE_BUTTONS}__spinner`;

export type TPurchaseButtonsProps = {
  productId: string;
  variantId: number;
  disabled?: boolean;
} & TIntrinsicDiv;

const PurchaseButtons: FC<TPurchaseButtonsProps> = (props) => {
  const { className, disabled, variantId, productId, ...rest } = props;
  const locale = useAppSelector(selectLocale);
  const classes = classNames(PURCHASE_BUTTONS, className);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    const setLoadingState = async () => {
      setIsLoading(true);
      await delay(500);
      setIsLoading(false);
    };

    void setLoadingState();
  }, [count]);

  const handleAddToCartBtnClick = useCallback(() => {
    if (disabled) {
      return;
    }
    setCount(1);
  }, [disabled]);

  let content;

  if (!count) {
    content = (
      <Button
        el="button"
        view="primary"
        theme="primary"
        icon={isLoading ? <ScreenLoader type="round" theme="white" /> : <FaShoppingCart />}
        text={localizedAppStrings[locale][AppStrings.AddToCart]}
        size="sm"
        iconBefore
        className={PURCHASE_BUTTONS_ADD_BTN}
        onClick={handleAddToCartBtnClick}
        disabled={disabled || isLoading}
      />
    );
  } else {
    content = (
      <>
        <Counter
          count={count}
          setCount={setCount}
          max={99}
          min={0}
          disabled={disabled || isLoading}
        />
        {isLoading && (
          <ScreenLoader type="round" theme="green" className={PURCHASE_BUTTONS_SPINNER} />
        )}
      </>
    );
  }

  return (
    <div {...rest} className={classes}>
      {content}
    </div>
  );
};

export default PurchaseButtons;
