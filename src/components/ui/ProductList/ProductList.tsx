import { FC, useMemo } from 'react';
import { TIntrinsicDiv, TProductProjection } from '../../../types/types';
import classNames from 'classnames';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.scss';

export const PRODUCT_LIST = 'product-list';
export const PRODUCTS_LIST_CARD = `${PRODUCT_LIST}__card`;

export type TProductListProps = { products?: TProductProjection[] } & TIntrinsicDiv;

const ProductList: FC<TProductListProps> = (props) => {
  const { className, products } = props;
  const classes = classNames(PRODUCT_LIST, className);

  const content = useMemo(
    () =>
      products?.map((product) => (
        <ProductCard className={PRODUCTS_LIST_CARD} key={product.id} product={product} />
      )),
    [products]
  );

  return <div className={classes}>{content}</div>;
};

export default ProductList;
