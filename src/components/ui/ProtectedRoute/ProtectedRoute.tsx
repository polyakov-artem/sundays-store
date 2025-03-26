import { FC, PropsWithChildren } from 'react';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectUserRole } from '../../../store/authSlice';
import { TokenRole } from '../../../services/authService';
import { Navigate, Outlet, useLocation } from 'react-router';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_LOGIN } from '../../../routes';

const ProtectedRoute: FC<PropsWithChildren> = () => {
  const role = useAppSelector(selectUserRole);
  const location = useLocation();

  return role === TokenRole.user ? (
    <Outlet />
  ) : (
    <Navigate to={getFullPath(VIEW_LOGIN)} replace state={{ from: location }} relative="path" />
  );
};

export default ProtectedRoute;
