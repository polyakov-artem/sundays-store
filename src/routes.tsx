import App from './App';
import ProtectedRoute from './components/ui/ProtectedRoute/ProtectedRoute';
import ViewAuth from './components/ui/ViewAuth/ViewAuth';
import ViewCategories from './components/ui/ViewCatalog/ViewCatalog';
import ViewHome from './components/ui/ViewHome/ViewHome';
import ViewNotFound from './components/ui/ViewNotFound/ViewNotFound';
import { PUBLIC_PATH } from './constants/constants';
import { RouteObject } from 'react-router';

export const VIEW_NOT_FOUND = 'not-found';
export const VIEW_LOGIN = 'login';
export const VIEW_PROFILE = 'profile';
export const VIEW_REGISTER = 'register';
export const VIEW_CATALOG = 'catalog';
export const VIEW_PRODUCT = 'product';
export const VIEW_CART = 'cart';

const routes: RouteObject[] = [
  {
    path: `${PUBLIC_PATH}`,
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: VIEW_PROFILE,
            element: 'Profile data',
          },
        ],
      },
      {
        path: VIEW_LOGIN,
        element: <ViewAuth type="login" />,
      },
      {
        index: true,
        element: <ViewHome />,
      },
      {
        path: `${VIEW_CATALOG}/:categoryId?`,
        element: <ViewCategories />,
      },
      {
        path: VIEW_CART,
        element: 'Cart data',
      },
      {
        path: `${VIEW_PRODUCT}/:categoryId/:productId`,
        element: 'Product data',
      },
      {
        path: VIEW_REGISTER,
        element: <ViewAuth type="register" />,
      },
      {
        path: `*`,
        element: <ViewNotFound />,
      },
      {
        path: VIEW_NOT_FOUND,
        element: <ViewNotFound />,
      },
    ],
  },
];

export default routes;
