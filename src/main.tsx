import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from './routes';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { apiClient } from './services/apiClient';
import { getAccessToken, tryToLoadToken } from './store/userSlice';
import { ErrorBoundary } from 'react-error-boundary';
import ViewError from './components/ui/ViewError/ViewError';
import 'normalize.css';
import './scss/index.scss';

const router = createBrowserRouter(routes);

apiClient.setTryToLoadToken(() => store.dispatch(tryToLoadToken()));
apiClient.setGetAccessToken(() => store.dispatch(getAccessToken()));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={<ViewError isRoot />}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
