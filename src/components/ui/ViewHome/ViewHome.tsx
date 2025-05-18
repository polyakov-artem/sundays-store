import { FC } from 'react';
import { Navigate } from 'react-router';
import { VIEW_CATALOG } from '../../../constants/constants';
import './ViewHome.scss';

export const VIEW_HOME = 'view-home';

const ViewHome: FC = () => {
  return <Navigate to={VIEW_CATALOG} replace />;
};

export default ViewHome;
