import { FC, memo, useEffect } from 'react';
import { useAppSelector } from '../../../hooks/store-hooks';
import { WRAPPER } from '../../../constants/cssHelpers';
import { selectUserRole } from '../../../store/userSlice';
import { useLazyGetMyActiveCartQuery } from '../../../store/userApi';
import LoaderBlock from '../LoaderBlock/LoaderBlock';
import ErrorBlock from '../ErrorBlock/ErrorBlock';
import EmptyCart from '../EmptyCart/EmptyCart';
import Cart from '../Cart/Cart';
import './ViewCart.scss';

export const VIEW_CART = 'view-cart';

const ViewCart: FC = () => {
  const role = useAppSelector(selectUserRole);
  const [getMyActiveCart, { data, isFetching, error }] = useLazyGetMyActiveCartQuery();

  let content;

  if (!data && isFetching) {
    content = <LoaderBlock />;
  } else if (error) {
    content = <ErrorBlock isBlock />;
  } else if (data === null || data?.lineItems.length === 0) {
    content = <EmptyCart />;
  } else if (data) {
    content = <Cart cart={data} isLoading={isFetching} />;
  }

  useEffect(() => {
    void getMyActiveCart();
  }, [getMyActiveCart, role]);

  return (
    <main className={VIEW_CART}>
      <div className={WRAPPER}>{content}</div>
    </main>
  );
};

export default memo(ViewCart);
