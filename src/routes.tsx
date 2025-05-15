import App from './App';
import ProtectedRoute from './components/ui/ProtectedRoute/ProtectedRoute';
import ViewAuth from './components/ui/ViewAuth/ViewAuth';
import ViewCategories from './components/ui/ViewCatalog/ViewCatalog';
import ViewHome from './components/ui/ViewHome/ViewHome';
import ViewNotFound from './components/ui/ViewNotFound/ViewNotFound';
import {
  PUBLIC_PATH,
  VIEW_CART,
  VIEW_CATALOG,
  VIEW_LOGIN,
  VIEW_NOT_FOUND,
  VIEW_PRODUCT,
  VIEW_PROFILE,
  VIEW_REGISTER,
} from './constants/constants';
import { RouteObject } from 'react-router';

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
