import { useMemo } from 'react';
import { TCrumb } from '../components/shared/Breadcrumbs/Breadcrumbs';
import { getFullPath } from '../utils/getFullPath';
import { VIEW_CATALOG } from '../constants/constants';
import { useAppSelector } from './store-hooks';
import {
  selectAllCategoriesEntities,
  selectCategoryById,
  useQueryCategoriesQuery,
} from '../store/storeApi';
import { selectLocale } from '../store/settingsSlice';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../utils/i18n/i18nKey';

export const useCrumbs = () => {
  const { categoryId } = useParams();
  const { isFetching } = useQueryCategoriesQuery();
  const allCategoriesEntities = useAppSelector(selectAllCategoriesEntities);
  const locale = useAppSelector(selectLocale);
  const currentCategory = useAppSelector((state) =>
    !categoryId ? undefined : selectCategoryById(state, categoryId)
  );
  const { t } = useTranslation();

  const crumbs: TCrumb[] = useMemo(() => {
    const result = [{ name: t(I18nKey.Catalog), url: getFullPath(VIEW_CATALOG) }];

    if (!currentCategory || isFetching) {
      return result;
    }

    currentCategory.ancestors.forEach((ancestorRef) => {
      result.push({
        url: getFullPath(VIEW_CATALOG, ancestorRef.id),
        name: allCategoriesEntities[ancestorRef.id]?.name[locale] || '',
      });
    });

    result.push({
      url: getFullPath(VIEW_CATALOG, currentCategory.id),
      name: currentCategory.name[locale],
    });

    return result;
  }, [allCategoriesEntities, currentCategory, isFetching, locale, t]);

  return crumbs;
};
