import { FC, useMemo } from 'react';
import { TIntrinsicDiv, TProductProjection } from '../../../types/types';
import classNames from 'classnames';
import ProductCard from '../ProductCard/ProductCard';
import { useSearchParams } from 'react-router';
import { VIEW_MODE, VIEW_MODE_LIST } from '../ProductsHeader/ProductsHeader';
import './ProductList.scss';

export const PRODUCT_LIST = 'product-list';
export const PRODUCT_LIST_MODE_LIST = `${PRODUCT_LIST}_mode_list`;
export const PRODUCTS_LIST_CARD = `${PRODUCT_LIST}__card`;

export type TProductListProps = { products?: TProductProjection[] } & TIntrinsicDiv;

const ProductList: FC<TProductListProps> = (props) => {
  const { className, products } = props;
  const [params] = useSearchParams();
  const isListMode = params.get(VIEW_MODE) === VIEW_MODE_LIST;
  const classes = classNames(PRODUCT_LIST, className, { [PRODUCT_LIST_MODE_LIST]: isListMode });

  const content = useMemo(
    () =>
      products?.map((product) => (
        <ProductCard
          className={PRODUCTS_LIST_CARD}
          key={product.id}
          product={product}
          isListMode={isListMode}
        />
      )),
    [products, isListMode]
  );

  return <div className={classes}>{content}</div>;
};

export default ProductList;
