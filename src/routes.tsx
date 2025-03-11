import App from './App';
import ViewNotFound from './components/ui/ViewNotFound/ViewNotFound';
import { PUBLIC_PATH } from './constants/constants';
import { RouteObject } from 'react-router';

export const VIEW_NOT_FOUND = 'not-found';

const routes: RouteObject[] = [
  {
    path: `${PUBLIC_PATH}`,
    element: <App />,
    children: [
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
