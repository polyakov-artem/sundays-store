import { FC, useMemo } from 'react';
import { TIntrinsicSection, TProductProjectionPagedSearchParams } from '../../../types/types';
import classNames from 'classnames';
import ProductList from '../ProductList/ProductList';
import {
  TCustomError,
  useGetProductDiscountsQuery,
  useSearchProductProjectionsQuery,
} from '../../../store/storeApi';
import { useParams, useSearchParams } from 'react-router';
import ProductsHeader, { SEARCH_TEXT, SORTING } from '../ProductsHeader/ProductsHeader';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { useParamValue } from '../../../hooks/useParamValue';
import { selectValues } from '../ProductsHeader/getSelectOptions';
import ScreenLoader from '../../shared/ScreenLoader/ScreenLoader';
import './Products.scss';

export const PRODUCTS = 'products';
export const PRODUCTS_LIST = `${PRODUCTS}__list`;
export const PRODUCTS_HEADER = `${PRODUCTS}__header`;
export const PRODUCTS_SPINNER = `${PRODUCTS}__spinner`;

export type TProductsProps = TIntrinsicSection;

const selectOptionsValidator = (value: string) => selectValues.includes(value);

const Products: FC<TProductsProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(PRODUCTS, className);
  const { id: categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const locale = useAppSelector(selectLocale);
  const searchText = useParamValue({
    key: SEARCH_TEXT,
    params: searchParams,
  });

  const sorting = useParamValue({
    key: SORTING,
    params: searchParams,
    validator: selectOptionsValidator,
  });

  const projectionsQueryParams = useMemo(() => {
    const params: TProductProjectionPagedSearchParams = {
      'filter.query': [`categories.id:"${categoryId}"`],
    };

    if (searchText) {
      params[`text.${locale}`] = `${searchText}`;
      params.fuzzy = true;
    }

    if (sorting) {
      const [key, direction] = sorting.split('_');
      if (key === 'name') {
        params.sort = `${key}.${locale} ${direction}`;
      }
      if (key === 'price') {
        params.sort = `${key} ${direction}`;
      }
    }

    return params;
  }, [categoryId, searchText, locale, sorting]);

  const {
    data: projectionsData,
    isFetching: areProjectionsFetching,
    isError: isProjectionsError,
    error: projectionsError,
  } = useSearchProductProjectionsQuery(projectionsQueryParams);

  const { isFetching: areDiscountsFetching } = useGetProductDiscountsQuery();

  let content;

  if (areProjectionsFetching || areDiscountsFetching) {
    content = <ScreenLoader type="linear" fullSpace className={PRODUCTS_SPINNER} />;
  } else if (isProjectionsError) {
    content = <p>Error: {(projectionsError as TCustomError).data}</p>;
  } else {
    content = (
      <>
        <ProductList className={PRODUCTS_LIST} products={projectionsData?.results} />
      </>
    );
  }

  return (
    <section className={classes} {...rest}>
      <ProductsHeader className={PRODUCTS_HEADER} />
      {content}
    </section>
  );
};

export default Products;
