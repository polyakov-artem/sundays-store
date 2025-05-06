import { FC, useMemo } from 'react';
import { Order, TIntrinsicDiv, TProductProjection } from '../../../types/types';
import classNames from 'classnames';
import ProductCard from '../ProductCard/ProductCard';
import { useLocation, useSearchParams } from 'react-router';
import { SORTING, VIEW_MODE, VIEW_MODE_LIST } from '../ProductsHeader/ProductsHeader';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectCountryCode, selectLocale } from '../../../store/settingsSlice';
import { selectUserRole } from '../../../store/authSlice';
import './ProductList.scss';

export const PRODUCT_LIST = 'product-list';
export const PRODUCT_LIST_MODE_LIST = `${PRODUCT_LIST}_mode_list`;
export const PRODUCT_LIST_CARD = `${PRODUCT_LIST}__card`;

export type TProductListProps = {
  productProjections?: TProductProjection[];
} & TIntrinsicDiv;

const ProductList: FC<TProductListProps> = (props) => {
  const { className, productProjections } = props;
  const [params] = useSearchParams();
  const countryCode = useAppSelector(selectCountryCode);
  const locale = useAppSelector(selectLocale);
  const location = useLocation();
  const role = useAppSelector(selectUserRole);
  const isListMode = params.get(VIEW_MODE) === VIEW_MODE_LIST;
  const classes = classNames(PRODUCT_LIST, className, { [PRODUCT_LIST_MODE_LIST]: isListMode });
  const sorting = params.get(SORTING);
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
          countryCode={countryCode}
          location={location}
          role={role}
          locale={locale}
        />
      )),
    [productProjections, isListMode, priceSorting, countryCode, location, role, locale]
  );

  return <div className={classes}>{content}</div>;
};

export default ProductList;
