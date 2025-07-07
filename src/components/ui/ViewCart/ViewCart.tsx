import { FC } from 'react';
import { useAppSelector } from '../../../hooks/store-hooks';
import { WRAPPER } from '../../../constants/cssHelpers';
import { selectUserRole } from '../../../store/userSlice';
import { useGetMyActiveCartQuery } from '../../../store/userApi';
import { TokenRole } from '../../../services/authService';
import { skipToken } from '@reduxjs/toolkit/query';
import LoaderBlock from '../LoaderBlock/LoaderBlock';
import ErrorBlock from '../ErrorBlock/ErrorBlock';
import EmptyCart from '../EmptyCart/EmptyCart';
import './ViewCart.scss';

export const VIEW_CART = 'view-cart';

const ViewCart: FC = () => {
  const role = useAppSelector(selectUserRole);
  const isBasicRole = role === TokenRole.basic;

  const {
    data: activeCart,
    isFetching: isActiveCartQueryFetching,
    isError: isActiveCartQueryError,
  } = useGetMyActiveCartQuery(isBasicRole ? skipToken : undefined);

  let content;

  const isEmptyCart = isBasicRole || activeCart?.lineItems.length === 0;

  if (isActiveCartQueryFetching) {
    content = <LoaderBlock />;
  } else if (isActiveCartQueryError) {
    content = <ErrorBlock isBlock />;
  } else if (isEmptyCart) {
    content = <EmptyCart />;
  } else if (activeCart) {
    content = <></>;
  }

  return (
    <main className={VIEW_CART}>
      <div className={WRAPPER}>{content}</div>
    </main>
  );
};

export default ViewCart;
