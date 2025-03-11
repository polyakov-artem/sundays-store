import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router';
import './Page.scss';

export const PAGE = 'page';

const Page: FC<PropsWithChildren> = () => {
  return (
    <div className={PAGE}>
      <Outlet />
    </div>
  );
};

export default Page;
