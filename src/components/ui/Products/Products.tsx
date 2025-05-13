import { FC, useMemo } from 'react';
import {
  CountryCurrency,
  TIntrinsicSection,
  TProductProjectionPagedSearchParams,
} from '../../../types/types';
import classNames from 'classnames';
import ProductList from '../ProductList/ProductList';
import {
  useGetProductDiscountsQuery,
  useSearchProductProjectionsQuery,
} from '../../../store/storeApi';
import { useParams, useSearchParams } from 'react-router';
import ProductsHeader, { SEARCH_TEXT, SORTING } from '../ProductsHeader/ProductsHeader';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectCountryCode, selectLocale } from '../../../store/settingsSlice';
import ErrorBlock from '../ErrorBlock/ErrorBlock';
import LoaderBlock from '../LoaderBlock/LoaderBlock';
import ProductFilter, {
  COLOR_FILTER_NAME,
  PRICE_FILTER_NAME,
  SIZE_FILTER_NAME,
  STOCK_FILTER_NAME,
} from '../ProductFilter/ProductFilter';
import './Products.scss';

export const PRODUCTS = 'products';
export const PRODUCTS_LIST = `${PRODUCTS}__list`;
export const PRODUCTS_HEADER = `${PRODUCTS}__header`;
export const PRODUCTS_FILTER_WRAP = `${PRODUCTS}__filter-wrap`;
export const PRODUCTS_FILTER = `${PRODUCTS}__filter`;

export type TProductsProps = TIntrinsicSection;

const Products: FC<TProductsProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(PRODUCTS, className);
  const { id: categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const locale = useAppSelector(selectLocale);
  const searchText = searchParams.get(SEARCH_TEXT);
  const sorting = searchParams.get(SORTING);
  const stockFilterValue = searchParams.get(STOCK_FILTER_NAME);
  const colorFilterValue = searchParams.get(COLOR_FILTER_NAME);
  const sizeFilterValue = searchParams.get(SIZE_FILTER_NAME);
  const priceFilterValue = searchParams.get(PRICE_FILTER_NAME);
  const countryCode = useAppSelector(selectCountryCode);

  const projectionsQueryParams = useMemo(() => {
    const params: TProductProjectionPagedSearchParams = {
      'filter.query': [`categories.id:"${categoryId}"`],
      markMatchingVariants: true,
      priceCurrency: CountryCurrency[countryCode],
      priceCountry: countryCode,
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
        params.sort = `variants.scopedPrice.currentValue.centAmount ${direction}`;
      }
    }

    if (stockFilterValue) {
      (params['filter.query'] as string[]).push('variants.availability.isOnStock:true');
    }

    if (colorFilterValue) {
      (params['filter.query'] as string[]).push(
        `variants.attributes.color.${locale}:${colorFilterValue}`
      );
    }

    if (sizeFilterValue) {
      (params['filter.query'] as string[]).push(
        `variants.attributes.size.${locale}:${sizeFilterValue}`
      );
    }

    if (priceFilterValue) {
      const [minPrice, maxPrice] = priceFilterValue.split(';');

      (params['filter.query'] as string[]).push(
        `variants.scopedPrice.currentValue.centAmount:range (${minPrice} to ${maxPrice})`
      );
    }

    return params;
  }, [
    categoryId,
    searchText,
    locale,
    sorting,
    countryCode,
    stockFilterValue,
    colorFilterValue,
    sizeFilterValue,
    priceFilterValue,
  ]);

  const {
    data: projectionsData,
    isFetching: areProjectionsFetching,
    isError: isProjectionsError,
  } = useSearchProductProjectionsQuery(projectionsQueryParams);

  const { isFetching: areDiscountsFetching } = useGetProductDiscountsQuery();

  let content;

  if (areProjectionsFetching || areDiscountsFetching) {
    content = <LoaderBlock className={PRODUCTS_LIST} isBlock />;
  } else if (isProjectionsError) {
    content = <ErrorBlock className={PRODUCTS_LIST} isBlock />;
  } else {
    content = (
      <>
        <ProductList
          key={JSON.stringify(projectionsQueryParams)}
          className={PRODUCTS_LIST}
          productProjections={projectionsData?.results}
        />
      </>
    );
  }

  return (
    <section className={classes} {...rest}>
      <ProductsHeader className={PRODUCTS_HEADER} />
      <div className={PRODUCTS_FILTER_WRAP}>
        <ProductFilter className={PRODUCTS_FILTER} />
      </div>
      {content}
    </section>
  );
};

export default Products;
