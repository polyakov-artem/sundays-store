import { FC, useMemo } from 'react';
import {
  selectAllCategories,
  TCustomError,
  useQueryCategoriesQuery,
} from '../../../store/storeApi';
import { Navigate } from 'react-router';
import { VIEW_NOT_FOUND } from '../../../routes';
import { getFullPath } from '../../../utils/getFullPath';
import Breadcrumbs from '../../shared/Breadcrumbs/Breadcrumbs';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import CategoryList from '../CategoryList/CategoryList.';
import { H1, WRAPPER } from '../../../constants/cssHelpers';
import classNames from 'classnames';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import Spinner from '../../shared/Spinner/Spinner';
import { useCrumbs } from '../../../hooks/useCrumbs';
import { useCurrentCategory } from '../../../hooks/useCurrentCategory';
import Products from '../Products/Products';
import './ViewCatalog.scss';

export const VIEW_CATALOG = 'view-catalog';
export const VIEW_CATALOG_TITLE = `${VIEW_CATALOG}__title`;
export const VIEW_CATALOG_BREADCRUMBS = `${VIEW_CATALOG}__breadcrumbs`;

const ViewCatalog: FC = () => {
  const locale = useAppSelector(selectLocale);
  const { isFetching, isError, error } = useQueryCategoriesQuery();
  const { currentCategory, id } = useCurrentCategory();
  const crumbs = useCrumbs(currentCategory);
  const allCategories = useAppSelector(selectAllCategories);

  const childCategoriesIds = useMemo(() => {
    return allCategories
      .filter((category) => category.parent?.id === currentCategory?.id)
      .map((category) => category.id);
  }, [allCategories, currentCategory]);

  let content;

  if (isFetching) {
    content = <Spinner fullSpace size="lg" theme="primary" />;
  } else if (isError) {
    content = <p>Error: {(error as TCustomError).data}</p>;
  } else if (currentCategory || id === undefined) {
    if (childCategoriesIds.length) {
      content = <CategoryList ids={childCategoriesIds} />;
    } else {
      content = <Products />;
    }
  } else {
    content = <Navigate to={getFullPath(VIEW_NOT_FOUND)} relative="path" replace />;
  }

  const title: string = currentCategory
    ? currentCategory.name[locale]
    : localizedAppStrings[locale].Catalog;

  return (
    <main className={VIEW_CATALOG}>
      <div className={WRAPPER}>
        <h1 className={classNames(H1, VIEW_CATALOG_TITLE)}>{title}</h1>
        <Breadcrumbs crumbs={crumbs} className={VIEW_CATALOG_BREADCRUMBS} />
        {content}
      </div>
    </main>
  );
};

export default ViewCatalog;
