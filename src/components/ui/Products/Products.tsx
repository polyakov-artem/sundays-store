import { FC } from 'react';
import { TIntrinsicSection } from '../../../types/types';
import classNames from 'classnames';
import ProductList from '../ProductList/ProductList';
import {
  TCustomError,
  useGetProductDiscountsQuery,
  useSearchProductProjectionsQuery,
} from '../../../store/storeApi';
import Spinner from '../../shared/Spinner/Spinner';
import { useParams } from 'react-router';
import './Products.scss';

export const PRODUCTS = 'products';
export const PRODUCTS_LIST = `${PRODUCTS}__list`;
export const PRODUCTS_SPINNER = `${PRODUCTS}__spinner`;

export type TProductsProps = TIntrinsicSection;

const Products: FC<TProductsProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(PRODUCTS, className);
  const { id: categoryId } = useParams();
  const {
    data: projectionsData,
    isFetching: areProjectionsFetching,
    isError: isProjectionsError,
    error: projectionsError,
  } = useSearchProductProjectionsQuery({
    filter: `categories.id:"${categoryId}"`,
  });

  const { isFetching: areDiscountsFetching } = useGetProductDiscountsQuery();

  let content;

  if (areProjectionsFetching || areDiscountsFetching) {
    content = <Spinner fullSpace size="lg" theme="primary" className={PRODUCTS_SPINNER} />;
  } else if (isProjectionsError) {
    content = <p>Error: {(projectionsError as TCustomError).data}</p>;
  } else {
    content = <ProductList className={PRODUCTS_LIST} products={projectionsData?.results} />;
  }

  return (
    <section className={classes} {...rest}>
      {content}
    </section>
  );
};

export default Products;
