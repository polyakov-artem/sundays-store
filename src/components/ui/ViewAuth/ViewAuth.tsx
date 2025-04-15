import { FC } from 'react';
import AuthWindow from '../AuthWindow/AuthWindow';
import { TAuthProps, TIntrinsicMain } from '../../../types/types';
import { useAppSelector } from '../../../hooks/store-hooks';
import { Navigate, useLocation } from 'react-router';
import { selectUserRole } from '../../../store/authSlice';
import { TokenRole } from '../../../services/authService';
import { PUBLIC_PATH } from '../../../constants/constants';
import './ViewAuth.scss';

export const VIEW_AUTH = 'view-auth';
export const VIEW_AUTH_WINDOW = `${VIEW_AUTH}__window`;

export type TAuthViewProps = TIntrinsicMain & TAuthProps;

const ViewAuth: FC<TAuthViewProps> = ({ type }) => {
  const role = useAppSelector(selectUserRole);
  const location = useLocation();

  if (role === TokenRole.user) {
    const from = (location as { state?: { from?: { pathname?: string } } }).state?.from?.pathname;
    return <Navigate to={from ? from : PUBLIC_PATH} relative="path" replace />;
  }

  return (
    <main className={VIEW_AUTH}>
      <AuthWindow className={VIEW_AUTH_WINDOW} type={type} />
    </main>
  );
};

export default ViewAuth;
