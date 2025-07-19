import { FC, memo, useMemo } from 'react';
import { selectAllCategories, useQueryCategoriesQuery } from '../../../store/storeApi';
import { Navigate } from 'react-router';
import { VIEW_NOT_FOUND } from '../../../constants/constants';
import { getFullPath } from '../../../utils/getFullPath';
import Breadcrumbs from '../../shared/Breadcrumbs/Breadcrumbs';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import CategoryList from '../CategoryList/CategoryList.';
import { H1, WRAPPER } from '../../../constants/cssHelpers';
import classNames from 'classnames';
import { useCrumbs } from '../../../hooks/useCrumbs';
import { useCurrentCategory } from '../../../hooks/useCurrentCategory';
import Products from '../Products/Products';
import ErrorBlock from '../ErrorBlock/ErrorBlock';
import LoaderBlock from '../LoaderBlock/LoaderBlock';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import './ViewCatalog.scss';

export const VIEW_CATALOG = 'view-catalog';
export const VIEW_CATALOG_TITLE = `${VIEW_CATALOG}__title`;
export const VIEW_CATALOG_BREADCRUMBS = `${VIEW_CATALOG}__breadcrumbs`;

const ViewCatalog: FC = () => {
  const locale = useAppSelector(selectLocale);
  const { isFetching, isError } = useQueryCategoriesQuery();
  const { currentCategory, categoryId } = useCurrentCategory();
  const crumbs = useCrumbs();
  const allCategories = useAppSelector(selectAllCategories);
  const { t } = useTranslation();

  const childCategoriesIds = useMemo(() => {
    return allCategories
      .filter((category) => category.parent?.id === currentCategory?.id)
      .map((category) => category.id);
  }, [allCategories, currentCategory]);

  let content;

  if (isFetching) {
    content = <LoaderBlock />;
  } else if (isError) {
    content = <ErrorBlock isBlock />;
  } else if (currentCategory || categoryId === undefined) {
    if (childCategoriesIds.length) {
      content = <CategoryList ids={childCategoriesIds} />;
    } else {
      content = <Products />;
    }
  } else {
    content = <Navigate to={getFullPath(VIEW_NOT_FOUND)} relative="path" replace />;
  }

  const title: string = currentCategory ? currentCategory.name[locale] : t(I18nKey.Catalog);

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

export default memo(ViewCatalog);
