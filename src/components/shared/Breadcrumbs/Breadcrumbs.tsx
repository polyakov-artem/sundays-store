import { FC, useMemo } from 'react';
import { Link } from 'react-router';
import { TIntrinsicUl } from '../../../types/types';
import classNames from 'classnames';
import './Breadcrumbs.scss';

export const BREADCRUMBS = 'breadcrumbs';
export const BREADCRUMBS_ITEM = `${BREADCRUMBS}__item`;
export const BREADCRUMBS_LINK = `${BREADCRUMBS}__link`;

export type TCrumb = {
  url: string;
  name: string;
};

export type TBreadcrumbsProps = TIntrinsicUl & {
  crumbs?: TCrumb[];
};

const Breadcrumbs: FC<TBreadcrumbsProps> = ({ crumbs, className }) => {
  const classes = classNames(BREADCRUMBS, className);

  const listItems = useMemo(
    () =>
      crumbs?.map(({ url, name }) => (
        <li key={url} className={BREADCRUMBS_ITEM}>
          <Link className={BREADCRUMBS_LINK} to={url} relative="path">
            {name}
          </Link>
        </li>
      )),
    [crumbs]
  );

  return <>{!!crumbs?.length && <ul className={classes}>{listItems}</ul>}</>;
};

export default Breadcrumbs;
