import { lazy } from 'react';
import App from './App';
import ProtectedRoute from './components/ui/ProtectedRoute/ProtectedRoute';

import {
  PUBLIC_PATH,
  VIEW_CART,
  VIEW_CATALOG,
  VIEW_LOGIN,
  VIEW_PRODUCT,
  VIEW_PROFILE,
  VIEW_REGISTER,
} from './constants/constants';
import { RouteObject } from 'react-router';
import ViewNotFound from './components/ui/ViewNotFound/ViewNotFound';

const ViewAuth = lazy(() => import('./components/ui/ViewAuth/ViewAuth'));
const ViewCart = lazy(() => import('./components/ui/ViewCart/ViewCart'));
const ViewCategories = lazy(() => import('./components/ui/ViewCatalog/ViewCatalog'));
const ViewHome = lazy(() => import('./components/ui/ViewHome/ViewHome'));
const ViewProduct = lazy(() => import('./components/ui/ViewProduct/ViewProduct'));
const ViewProfile = lazy(() => import('./components/ui/ViewProfile/ViewProfile'));

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
            element: <ViewProfile />,
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
        element: <ViewCart />,
      },
      {
        path: `${VIEW_PRODUCT}/:categoryId/:productId`,
        element: <ViewProduct />,
      },
      {
        path: VIEW_REGISTER,
        element: <ViewAuth type="register" />,
      },
      {
        path: `*`,
        element: <ViewNotFound />,
      },
    ],
  },
];

export default routes;
