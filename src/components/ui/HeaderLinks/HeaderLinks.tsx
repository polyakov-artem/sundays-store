import { FC, useMemo } from 'react';
import { NavLink } from 'react-router';
import classNames from 'classnames';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectMainCategories, useQueryCategoriesQuery } from '../../../store/storeApi';
import { selectLocale } from '../../../store/settingsSlice';
import { TIntrinsicUl } from '../../../types/types';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_CATALOG } from '../../../routes';
import './HeaderLinks.scss';

export const HEADER_LINKS = 'header-links';
export const HEADER_LINKS_ITEM = 'header-links__item';
export const HEADER_LINKS_LINK = `${HEADER_LINKS}__link`;
export const HEADER_LINKS_TEXT = `${HEADER_LINKS}__text`;
export const LINK_PENDING_CLASS_NAME = `${HEADER_LINKS_LINK}_pending`;
export const LINK_ACTIVE_CLASS_NAME = `${HEADER_LINKS_LINK}_active`;
export const LINK_TRANSITIONING_CLASS_NAME = `${HEADER_LINKS_LINK}_transitioning`;

const linkClassNameHandler = ({ isActive, isPending, isTransitioning }: Record<string, boolean>) =>
  classNames(HEADER_LINKS_LINK, {
    [LINK_PENDING_CLASS_NAME]: isPending,
    [LINK_ACTIVE_CLASS_NAME]: isActive,
    [LINK_TRANSITIONING_CLASS_NAME]: isTransitioning,
  });

export type THeaderLinksProps = TIntrinsicUl;

const HeaderLinks: FC<THeaderLinksProps> = (props) => {
  const { className } = props;
  const classes = classNames(HEADER_LINKS, className);
  const { isLoading } = useQueryCategoriesQuery();
  const categories = useAppSelector(selectMainCategories);
  const locale = useAppSelector(selectLocale);

  const links = useMemo(() => {
    return categories.map(({ id, name }) => (
      <li className={HEADER_LINKS_ITEM} key={id}>
        <NavLink
          to={getFullPath(VIEW_CATALOG, id)}
          className={linkClassNameHandler}
          relative="path">
          <span className={HEADER_LINKS_TEXT}>{name[locale]}</span>
        </NavLink>
      </li>
    ));
  }, [locale, categories]);

  return <ul className={classes}>{!isLoading && links}</ul>;
};

export default HeaderLinks;
