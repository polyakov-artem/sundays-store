import { FC, memo, PropsWithChildren } from 'react';
import { Outlet } from 'react-router';
import Header from '../Header/Header';
import './Page.scss';

export const PAGE = 'page';

const Page: FC<PropsWithChildren> = () => {
  return (
    <div className={PAGE}>
      <Header />
      <Outlet />
    </div>
  );
};

export default memo(Page);
