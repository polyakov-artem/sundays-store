import { createApi } from '@reduxjs/toolkit/query/react';
import {
  TCategory,
  TExtProductProjection,
  TExtProductProjectionPagedSearchResponse,
  TGetProductDiscountsParams,
  TGetProductProjectionByIdParams,
  TProductDiscount,
  TProductDiscountPagedQueryResponse,
  TProductProjection,
  TProductProjectionPagedSearchParams,
  TProductProjectionPagedSearchResponse,
  TQueryCategoriesParams,
} from '../types/types';
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { getQueryString } from '../utils/getQueryString';
import { getPriceData } from '../utils/getPriceData';
import { axiosBaseQuery } from './axiosBaseQuery';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Product', 'Cart', 'Category'],
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    queryCategories: builder.query<TCategory[], TQueryCategoriesParams | void>({
      query: (params: TQueryCategoriesParams = { limit: 500 }) => ({
        url: `${projectKey}/categories`,
        params,
      }),
      transformResponse: (response: { results: TCategory[] }) => {
        return response.results;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Category' as const, id })), 'Category']
          : ['Category'],
    }),

    searchProductProjections: builder.query<
      TExtProductProjectionPagedSearchResponse,
      TProductProjectionPagedSearchParams | void
    >({
      query: (params?: TProductProjectionPagedSearchParams) => {
        return {
          url: `${projectKey}/product-projections/search`,
          data: getQueryString(params),
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        };
      },
      transformResponse: (response: TProductProjectionPagedSearchResponse) => {
        const extResponse = { ...response } as TExtProductProjectionPagedSearchResponse;

        extResponse.results.forEach((projection) => {
          const { masterVariant, variants } = projection;
          [masterVariant, ...variants].forEach((variant) => {
            const {
              scopedPrice: { value, discounted },
            } = variant;
            variant.priceData = getPriceData(value, discounted);
          });
        });

        return extResponse;
      },
    }),

    getProductDiscounts: builder.query<TProductDiscount[], TGetProductDiscountsParams | void>({
      query: (params: TGetProductDiscountsParams = { limit: 500 }) => {
        return {
          url: `${projectKey}/product-discounts`,
          params,
          method: 'GET',
        };
      },
      transformResponse: (response: TProductDiscountPagedQueryResponse) => {
        return response.results;
      },
    }),

    getProductProjectionById: builder.query<TExtProductProjection, TGetProductProjectionByIdParams>(
      {
        query: ({ id, params }) => ({
          url: `${projectKey}/product-projections/${id}`,
          params,
        }),

        transformResponse: (response: TProductProjection) => {
          const extResponse = { ...response } as TExtProductProjection;

          const { masterVariant, variants } = extResponse;
          [masterVariant, ...variants].forEach((variant) => {
            const {
              price: { value, discounted },
            } = variant;
            variant.priceData = getPriceData(value, discounted);
          });
          return extResponse;
        },

        providesTags: (result) =>
          result ? [{ type: 'Product' as const, id: result.id }] : ['Product'],
      }
    ),
  }),
});

const categoriesAdapter = createEntityAdapter<TCategory>();
export const categoriesAdapterInitialState = categoriesAdapter.getInitialState();

export const selectQueryCategoriesResult = storeApi.endpoints.queryCategories.select();

export const selectCategoriesAdapterState = createSelector(
  [selectQueryCategoriesResult],
  (result) => {
    return !result.data
      ? categoriesAdapterInitialState
      : categoriesAdapter.setAll(categoriesAdapterInitialState, result.data);
  }
);

const discountsAdapter = createEntityAdapter<TProductDiscount>();
export const discountsAdapterInitialState = discountsAdapter.getInitialState();

export const selectGetProductDiscountsResult = storeApi.endpoints.getProductDiscounts.select();

export const selectGetProductDiscountsAdapterState = createSelector(
  [selectGetProductDiscountsResult],
  (result) => {
    return !result.data
      ? discountsAdapterInitialState
      : discountsAdapter.setAll(discountsAdapterInitialState, result.data);
  }
);

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
  selectIds: selectCategoriesIds,
  selectEntities: selectAllCategoriesEntities,
} = categoriesAdapter.getSelectors(selectCategoriesAdapterState);

export const selectMainCategories = createSelector([selectAllCategories], (categories) =>
  categories.filter((category) => category.ancestors.length === 0)
);

export const {
  useQueryCategoriesQuery,
  useSearchProductProjectionsQuery,
  useGetProductDiscountsQuery,
  useGetProductProjectionByIdQuery,
} = storeApi;
