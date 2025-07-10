import { FC } from 'react';
import { TExtCart, TIntrinsicSection } from '../../../types/types';
import classNames from 'classnames';
import { H1 } from '../../../constants/cssHelpers';
import CartProducts from '../CartProducts/CartProducts';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectIsUpdatingCart } from '../../../store/userSlice';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import { selectLocale } from '../../../store/settingsSlice';
import CartSum from '../CartSum/CartSum';
import './Cart.scss';

export const CART = 'cart';
export const CART_TITLE = `${CART}__title`;
export const CART_GRID = `${CART}__grid`;

export type TCartProps = { cart: TExtCart; isLoading: boolean } & TIntrinsicSection;

const Cart: FC<TCartProps> = (props) => {
  const { className, cart, isLoading, ...rest } = props;
  const classes = classNames(CART, className);
  const titleClasses = classNames(H1, CART_TITLE);
  const isUpdatingCart = useAppSelector(selectIsUpdatingCart);
  const isDisabled = isUpdatingCart || isLoading;
  const locale = useAppSelector(selectLocale);

  return (
    <section className={classes} {...rest}>
      <h1 className={titleClasses}>{localizedAppStrings[locale][AppStrings.Cart]}</h1>
      <div className={CART_GRID}>
        <CartProducts items={cart.lineItems} isDisabled={isDisabled} />
        <CartSum cart={cart} isDisabled={isDisabled} />
      </div>
    </section>
  );
};

export default Cart;
