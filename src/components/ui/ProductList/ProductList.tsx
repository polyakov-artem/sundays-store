import { FC, useMemo } from 'react';
import { Order, TExtProductProjection, TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import ProductCard from '../ProductCard/ProductCard';
import { useParams, useSearchParams } from 'react-router';
import { SORTING, VIEW_MODE, VIEW_MODE_LIST } from '../ProductsHeader/ProductsHeader';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import './ProductList.scss';
import { selectGetProductDiscountsAdapterState } from '../../../store/storeApi';
import { useRedirectionOfUnauthorized } from '../../../hooks/useRedirectionOfUnauthorized';

export const PRODUCT_LIST = 'product-list';
export const PRODUCT_LIST_MODE_LIST = `${PRODUCT_LIST}_mode_list`;
export const PRODUCT_LIST_CARD = `${PRODUCT_LIST}__card`;

export type TProductListProps = {
  productProjections?: TExtProductProjection[];
} & TIntrinsicDiv;

const ProductList: FC<TProductListProps> = (props) => {
  const { className, productProjections } = props;
  const [params] = useSearchParams();
  const locale = useAppSelector(selectLocale);
  const isListMode = params.get(VIEW_MODE) === VIEW_MODE_LIST;
  const classes = classNames(PRODUCT_LIST, className, { [PRODUCT_LIST_MODE_LIST]: isListMode });
  const sorting = params.get(SORTING);
  const { categoryId } = useParams();
  const discounts = useAppSelector(selectGetProductDiscountsAdapterState);
  const { redirectUnauthorized } = useRedirectionOfUnauthorized();

  const priceSorting = useMemo(() => {
    if (sorting) {
      const [key, direction] = sorting.split('_');
      const order = direction as Order;

      if (key === 'price' && (order === Order.asc || order === Order.desc)) {
        return order;
      }
    }
  }, [sorting]);

  const content = useMemo(
    () =>
      productProjections?.map((productProjection) => (
        <ProductCard
          className={PRODUCT_LIST_CARD}
          key={productProjection.id}
          productProjection={productProjection}
          isListMode={isListMode}
          priceSorting={priceSorting}
          locale={locale}
          categoryId={categoryId}
          discounts={discounts}
          redirectUnauthorized={redirectUnauthorized}
        />
      )),
    [
      productProjections,
      isListMode,
      priceSorting,
      locale,
      categoryId,
      discounts,
      redirectUnauthorized,
    ]
  );

  return <div className={classes}>{content}</div>;
};

export default ProductList;
