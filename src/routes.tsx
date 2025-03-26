import App from './App';
import ProtectedRoute from './components/ui/ProtectedRoute/ProtectedRoute';
import ViewAuth from './components/ui/ViewAuth/ViewAuth';
import ViewNotFound from './components/ui/ViewNotFound/ViewNotFound';
import { PUBLIC_PATH } from './constants/constants';
import { RouteObject } from 'react-router';

export const VIEW_NOT_FOUND = 'not-found';
export const VIEW_LOGIN = 'login';
export const VIEW_MAIN = 'main';
export const VIEW_PROFILE = 'profile';
export const VIEW_REGISTER = 'register';

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
        path: VIEW_MAIN,
        element: 'Main view data',
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
