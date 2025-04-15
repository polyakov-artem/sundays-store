import { FC, useMemo } from 'react';
import CategoryItem from '../CategoryItem/CategoryItem';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import './CategoryList.scss';

export const CATEGORY_LIST = 'category-list';

export type TCategoryListProps = {
  ids: string[];
};

const CategoryList: FC<TCategoryListProps> = ({ ids }) => {
  const locale = useAppSelector(selectLocale);

  const listItems = useMemo(
    () => ids.map((id) => <CategoryItem key={id} id={id} locale={locale} />),
    [ids, locale]
  );

  return <>{!!ids.length && <ul className={CATEGORY_LIST}>{listItems}</ul>}</>;
};

export default CategoryList;
