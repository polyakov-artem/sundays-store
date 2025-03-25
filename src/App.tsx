import { FC, useEffect, useState } from 'react';
import Page from './components/ui/Page/Page';
import './scss/index.scss';
import { useAppDispatch } from './hooks/store-hooks';
import { loadInitialTokens } from './store/authSlice';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const [lsTokensAreLoaded, setLSTokenAreLoaded] = useState(false);

  useEffect(() => {
    dispatch(loadInitialTokens());
    setLSTokenAreLoaded(true);
  }, [dispatch]);

  return <>{lsTokensAreLoaded ? <Page /> : null}</>;
};

export default App;
