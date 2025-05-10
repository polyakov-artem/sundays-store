import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig } from 'axios';
import { httpService, HttpService } from '../services/httpService';
import { AppGetState } from './store';
import {
  TCategory,
  TCustomer,
  TCustomerSignInResult,
  TExtProductProjectionPagedSearchResponse,
  TExtProductVariant,
  TGetProductDiscountsParams,
  TMyCustomerDraft,
  TProductDiscount,
  TProductDiscountPagedQueryResponse,
  TProductProjectionPagedSearchParams,
  TProductProjectionPagedSearchResponse,
  TQueryCategoriesParams,
} from '../types/types';
import { getMsgFromAxiosError } from '../utils/getMsgFromAxiosError';
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { getQueryString } from '../utils/getQueryString';
import { getPriceData } from '../utils/getPriceData';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

export type TAxiosBaseQueryParams = { httpService: HttpService };

export type TCustomError = {
  status?: number;
  data: string;
};

const axiosBaseQuery = ({
  httpService,
}: TAxiosBaseQueryParams): BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
  },
  unknown,
  TCustomError
> => {
  return async ({ url, method, data, params, headers }, { dispatch, getState }) => {
    httpService.setDispatchFn(dispatch);
    httpService.setGetStateFn(getState as AppGetState);
    const client = httpService.getClient();

    try {
      const result = await client({
        url,
        method,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        params,
        headers,
      });
      return { data: result.data };
    } catch (err: unknown) {
      return {
        error: {
          status: (err as { status?: number })?.status,
          data: getMsgFromAxiosError(err),
        },
      };
    }
  };
};

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: axiosBaseQuery({ httpService }),
  tagTypes: ['Customer', 'Category', 'Product'],
  endpoints: (builder) => ({
    getMe: builder.query<TCustomer, void>({
      query: () => ({ url: `${projectKey}/me` }),
      providesTags: ['Customer'],
    }),

    signUp: builder.mutation<TCustomerSignInResult, TMyCustomerDraft>({
      query: (data: TMyCustomerDraft) => ({
        url: `${projectKey}/me/signup`,
        data,
        method: 'POST',
      }),
      invalidatesTags: ['Customer'],
    }),

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
        response.results.forEach((projection) => {
          const { masterVariant, variants } = projection;
          [masterVariant, ...variants].forEach((variant) => {
            if (variant.isMatchingVariant) {
              const {
                scopedPrice: { value, discounted },
              } = variant;
              (variant as TExtProductVariant).priceData = getPriceData(value, discounted);
            }
          });
        });

        return response;
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
  useGetMeQuery,
  useSignUpMutation,
  useQueryCategoriesQuery,
  useSearchProductProjectionsQuery,
  useGetProductDiscountsQuery,
} = storeApi;
