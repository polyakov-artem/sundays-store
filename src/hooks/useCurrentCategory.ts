import { useAppSelector } from './store-hooks';
import { selectCategoryById } from '../store/storeApi';
import { useParams } from 'react-router';

export const useCurrentCategory = () => {
  const { categoryId } = useParams();

  const currentCategory = useAppSelector((state) =>
    !categoryId ? undefined : selectCategoryById(state, categoryId)
  );

  return { currentCategory, categoryId };
};
