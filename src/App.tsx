import { FC, useEffect, useState } from 'react';
import Page from './components/ui/Page/Page';
import 'normalize.css';
import './scss/index.scss';
import { useAppDispatch } from './hooks/store-hooks';
import { loadInitialTokens } from './store/authSlice';
import SvgSprite from './components/shared/SvgSprite/SvgSprite';
import { Slide, ToastContainer } from 'react-toastify';

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </>
  );
};

export default App;
