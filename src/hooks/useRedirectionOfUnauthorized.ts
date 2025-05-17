import { useCallback } from 'react';
import { useAppSelector } from './store-hooks';
import { selectIsLoggedIn } from '../store/authSlice';
import { useLoginRedirectionProps } from './useLoginRedirectionProps';
import { useNavigate } from 'react-router';

export type TRedirectUnauthorized = ReturnType<
  typeof useRedirectionOfUnauthorized
>['redirectUnauthorized'];

export const useRedirectionOfUnauthorized = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const { loginNavigatePath, loginNavigateProps } = useLoginRedirectionProps();
  const navigate = useNavigate();

  const redirectUnauthorized = useCallback(() => {
    if (!isLoggedIn) {
      return navigate(loginNavigatePath, loginNavigateProps);
    }
  }, [isLoggedIn, loginNavigatePath, loginNavigateProps, navigate]);

  return { redirectUnauthorized, isLoggedIn };
};
