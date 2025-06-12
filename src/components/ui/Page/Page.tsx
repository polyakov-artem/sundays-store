import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router';
import Header from '../Header/Header';
import './Page.scss';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectUserRole } from '../../../store/authSlice';

export const PAGE = 'page';

const Page: FC<PropsWithChildren> = () => {
  const role = useAppSelector(selectUserRole);

  return (
    <div className={PAGE}>
      <Header key={role} />
      <Outlet />
    </div>
  );
};

export default Page;
