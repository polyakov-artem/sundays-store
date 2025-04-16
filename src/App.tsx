import { FC, useEffect, useState } from 'react';
import Page from './components/ui/Page/Page';
import 'normalize.css';
import './scss/index.scss';
import { useAppDispatch, useAppSelector } from './hooks/store-hooks';
import { loadInitialTokens, selectUserRole } from './store/authSlice';
import { useGetMeQuery } from './store/storeApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { TokenRole } from './services/authService';
import SvgSprite from './components/shared/SvgSprite/SvgSprite';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const [lsTokensAreLoaded, setLSTokenAreLoaded] = useState(false);
  const role = useAppSelector(selectUserRole);
  const { data, isLoading } = useGetMeQuery(role === TokenRole.user ? undefined : skipToken);
  console.log('userData', !isLoading && data);

  useEffect(() => {
    dispatch(loadInitialTokens());
    setLSTokenAreLoaded(true);
  }, [dispatch]);

  return (
    <>
      <SvgSprite />
      <>{lsTokensAreLoaded ? <Page /> : null}</>
    </>
  );
};

export default App;
