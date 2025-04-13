import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig } from 'axios';
import { httpService, HttpService } from '../services/httpService';
import { AppGetState } from './store';
import {
  TCategory,
  TCustomer,
  TCustomerSignInResult,
  TMyCustomerDraft,
  TQueryCategoriesParams,
} from '../types/types';
import { getMsgFromAxiosError } from '../utils/getMsgFromAxiosError';
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';

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
const categoriesAdapter = createEntityAdapter<TCategory>();
export const categoriesAdapterInitialState = categoriesAdapter.getInitialState();

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: axiosBaseQuery({ httpService }),
  tagTypes: ['Customer', 'Category'],
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
  }),
});

export const selectQueryCategoriesResult = storeApi.endpoints.queryCategories.select();

export const selectCategoriesAdapterState = createSelector(
  [selectQueryCategoriesResult],
  (result) => {
    return !result.data
      ? categoriesAdapterInitialState
      : categoriesAdapter.setAll(categoriesAdapterInitialState, result.data);
  }
);

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
  selectIds: selectCategoriesIds,
  selectEntities: selectAllCategoriesEntities,
} = categoriesAdapter.getSelectors(selectCategoriesAdapterState);

export const { useGetMeQuery, useSignUpMutation, useQueryCategoriesQuery } = storeApi;
