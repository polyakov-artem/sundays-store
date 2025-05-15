import { useLocation } from 'react-router';
import { useMemo } from 'react';
import { getFullPath } from '../utils/getFullPath';
import { VIEW_LOGIN } from '../constants/constants';

const loginNavigatePath = getFullPath(VIEW_LOGIN);

export const useLoginRedirectionProps = () => {
  const location = useLocation();

  const loginNavigateProps = useMemo(() => {
    return {
      replace: true,
      state: { from: location },
      relative: 'path' as const,
    };
  }, [location]);

  const loginNavigationProps = useMemo(
    () => ({ ...loginNavigateProps, to: loginNavigatePath }),
    [loginNavigateProps]
  );

  return { loginNavigatePath, loginNavigationProps, loginNavigateProps };
};
