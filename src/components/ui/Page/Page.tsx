import { FC, memo, PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router';
import Header from '../Header/Header';
import { ErrorBoundary } from 'react-error-boundary';
import ViewError from '../ViewError/ViewError';
import './Page.scss';
import ScreenLoader from '../../shared/ScreenLoader/ScreenLoader';

export const PAGE = 'page';
export const PAGE_LOADER = `${PAGE}__loader`;

const Page: FC<PropsWithChildren> = () => {
  return (
    <div className={PAGE}>
      <Header />
      <ErrorBoundary fallback={<ViewError />}>
        <Suspense fallback={<ScreenLoader className={PAGE_LOADER} />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default memo(Page);
