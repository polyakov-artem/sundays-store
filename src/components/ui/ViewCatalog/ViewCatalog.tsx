import { FC, useMemo } from 'react';
import {
  selectAllCategories,
  selectAllCategoriesEntities,
  selectCategoryById,
  TCustomError,
  useQueryCategoriesQuery,
} from '../../../store/storeApi';
import { Navigate, useParams } from 'react-router';
import { VIEW_CATALOG as VIEW_CATALOG_ROUTE, VIEW_NOT_FOUND } from '../../../routes';
import { getFullPath } from '../../../utils/getFullPath';
import Breadcrumbs, { TCrumb } from '../../shared/Breadcrumbs/Breadcrumbs';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import CategoryList from '../CategoryList/CategoryList.';
import { H1, WRAPPER } from '../../../constants/cssHelpers';
import classNames from 'classnames';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import Spinner from '../../shared/Spinner/Spinner';
import './ViewCatalog.scss';

export const VIEW_CATALOG = 'view-catalog';
export const VIEW_CATALOG_TITLE = `${VIEW_CATALOG}__title`;
export const VIEW_CATALOG_BREADCRUMBS = `${VIEW_CATALOG}__breadcrumbs`;

const ViewCatalog: FC = () => {
  const locale = useAppSelector(selectLocale);
  const { isFetching, isError, error } = useQueryCategoriesQuery();
  const { id } = useParams();

  const allCategories = useAppSelector(selectAllCategories);
  const allCategoriesEntities = useAppSelector(selectAllCategoriesEntities);

  const currentCategory = useAppSelector((state) =>
    id ? selectCategoryById(state, id) : undefined
  );

  const isCorrectId: boolean | undefined = useMemo(() => {
    if (isFetching || id === undefined) {
      return undefined;
    } else {
      return !!currentCategory;
    }
  }, [currentCategory, isFetching, id]);

  const childCategoriesIds: string[] = useMemo(
    () =>
      allCategories.filter((category) => category.parent?.id === id).map((category) => category.id),
    [allCategories, id]
  );

  const rootTitle = localizedAppStrings[locale].Catalog;

  const crumbs: TCrumb[] = useMemo(() => {
    const result = [{ name: rootTitle, url: getFullPath(VIEW_CATALOG_ROUTE) }];

    if (!isCorrectId) {
      return result;
    }

    if (currentCategory) {
      currentCategory.ancestors.forEach((ancestorRef) => {
        result.push({
          url: getFullPath(VIEW_CATALOG_ROUTE, ancestorRef.id),
          name: allCategoriesEntities[ancestorRef.id]?.name[locale] || '',
        });
      });

      result.push({
        url: getFullPath(VIEW_CATALOG_ROUTE, currentCategory.id),
        name: currentCategory.name[locale],
      });
    }

    return result;
  }, [isCorrectId, currentCategory, allCategoriesEntities, locale, rootTitle]);

  let content;

  if (isFetching) {
    content = <Spinner fullSpace size="lg" theme="primary" />;
  } else if (isError) {
    content = <p>Error: {(error as TCustomError).data}</p>;
  } else if (isCorrectId !== false) {
    content = <CategoryList ids={childCategoriesIds} />;
  } else {
    content = <Navigate to={getFullPath(VIEW_NOT_FOUND)} relative="path" replace />;
  }

  const title: string = currentCategory ? currentCategory.name[locale] : rootTitle;

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
