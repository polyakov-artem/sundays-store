import { useMemo } from 'react';
import { TCrumb } from '../components/shared/Breadcrumbs/Breadcrumbs';
import { getFullPath } from '../utils/getFullPath';
import { VIEW_CATALOG } from '../routes';
import { localizedAppStrings } from '../constants/localizedAppStrings';
import { useAppSelector } from './store-hooks';
import { selectAllCategoriesEntities } from '../store/storeApi';
import { selectLocale } from '../store/settingsSlice';
import { TCategory } from '../types/types';

export const useCrumbs = (currentCategory?: TCategory) => {
  const allCategoriesEntities = useAppSelector(selectAllCategoriesEntities);
  const locale = useAppSelector(selectLocale);

  const crumbs: TCrumb[] = useMemo(() => {
    const result = [{ name: localizedAppStrings[locale].Catalog, url: getFullPath(VIEW_CATALOG) }];

    if (!currentCategory) {
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
  }, [allCategoriesEntities, locale, currentCategory]);

  return crumbs;
};
