import { FC, memo } from 'react';
import { CountryLocale } from '../../../types/types';
import { Link } from 'react-router';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_CATALOG } from '../../../constants/constants';
import classNames from 'classnames';
import { MEDIA_COVER } from '../../../constants/cssHelpers';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectCategoryById } from '../../../store/storeApi';
import './CategoryItem.scss';

export const CATEGORY_ITEM = 'category-item';
export const CATEGORY_ITEM_NAME = `${CATEGORY_ITEM}__name`;
export const CATEGORY_ITEM_LINK = `${CATEGORY_ITEM}__link`;
export const CATEGORY_ITEM_IMG_WRAP = `${CATEGORY_ITEM}__img-wrap`;
export const CATEGORY_ITEM_IMG = `${CATEGORY_ITEM}__img`;
export const IMAGES_FOLDER_NAME = 'categories';

export type TCategoryItemProps = {
  id: string;
  locale: CountryLocale;
};

const CategoryItem: FC<TCategoryItemProps> = ({ id, locale }) => {
  const category = useAppSelector((state) => selectCategoryById(state, id));
  const imgSrc = getFullPath(IMAGES_FOLDER_NAME, category?.key || '') + '.jpg';
  const name = category?.name[locale];

  return (
    <li className={CATEGORY_ITEM}>
      <Link className={CATEGORY_ITEM_LINK} to={getFullPath(VIEW_CATALOG, id)} relative="path">
        <div className={CATEGORY_ITEM_IMG_WRAP}>
          <img className={classNames(CATEGORY_ITEM_IMG, MEDIA_COVER)} src={imgSrc} alt={name} />
        </div>
        <p className={CATEGORY_ITEM_NAME}>{name}</p>
      </Link>
    </li>
  );
};

export default memo(CategoryItem);
