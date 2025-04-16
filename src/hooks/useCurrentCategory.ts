import { useAppSelector } from './store-hooks';
import { selectCategoryById } from '../store/storeApi';
import { useParams } from 'react-router';

export const useCurrentCategory = () => {
  const { id } = useParams();

  const currentCategory = useAppSelector((state) =>
    !id ? undefined : selectCategoryById(state, id)
  );

  return { currentCategory, id };
};
