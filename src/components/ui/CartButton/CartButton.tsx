import { FC, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Button from '../../shared/Button/Button';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_CART } from '../../../constants/constants';
import classNames from 'classnames';
import { TIntrinsicDiv } from '../../../types/types';
import { useLazyGetMyActiveCartQuery } from '../../../store/userApi';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectUserRole } from '../../../store/userSlice';
import './CartButton.scss';

export type TCartButtonProps = TIntrinsicDiv;

export const CART_BUTTON = 'cart-button';
export const CART_BUTTON_BADGE = `${CART_BUTTON}__badge`;
export const CART_BUTTON_BADGE_TEXT = `${CART_BUTTON}__badge-text`;

const CartButton: FC<TCartButtonProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(CART_BUTTON, className);
  const role = useAppSelector(selectUserRole);

  const [getMyActiveCart, { data, isError }] = useLazyGetMyActiveCartQuery();
  const count = !isError && data ? data.totalLineItemQuantity : 0;

  useEffect(() => {
    void getMyActiveCart();
  }, [getMyActiveCart, role]);

  return (
    <div {...rest} className={classes}>
      <Button
        view="figure"
        el="link"
        theme="primary"
        to={getFullPath(VIEW_CART)}
        relative="path"
        text={'Cart'}
        icon={<FaShoppingCart />}
      />
      {!!count && <span className={CART_BUTTON_BADGE}>{count}</span>}
    </div>
  );
};

export default CartButton;
