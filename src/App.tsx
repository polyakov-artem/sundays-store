import { FC, useEffect, useState } from 'react';
import Page from './components/ui/Page/Page';
import 'normalize.css';
import './scss/index.scss';
import { useAppDispatch } from './hooks/store-hooks';
import { loadInitialTokens } from './store/authSlice';
import SvgSprite from './components/shared/SvgSprite/SvgSprite';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const [lsTokensAreLoaded, setLSTokenAreLoaded] = useState(false);

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
