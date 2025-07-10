import { FC, PropsWithChildren } from 'react';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectUserRole } from '../../../store/userSlice';
import { TokenRole } from '../../../services/authService';
import { Navigate, Outlet } from 'react-router';
import { useLoginRedirectionProps } from '../../../hooks/useLoginRedirectionProps';

const ProtectedRoute: FC<PropsWithChildren> = () => {
  const role = useAppSelector(selectUserRole);
  const { loginNavigationProps } = useLoginRedirectionProps();

  return role === TokenRole.user ? <Outlet /> : <Navigate {...loginNavigationProps} />;
};

export default ProtectedRoute;
