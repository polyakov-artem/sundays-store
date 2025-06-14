import 'normalize.css';
import './scss/index.scss';
import { FC } from 'react';
import Page from './components/ui/Page/Page';
import SvgSprite from './components/shared/SvgSprite/SvgSprite';
import { Slide, ToastContainer } from 'react-toastify';

const App: FC = () => {
  return (
    <>
      <SvgSprite />
      <Page />
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
