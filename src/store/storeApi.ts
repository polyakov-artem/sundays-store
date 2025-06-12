import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig } from 'axios';
import { httpService, HttpService } from '../services/httpService';
import { AppGetState, RootState } from './store';
import {
  TCart,
  TCartDraft,
  TCategory,
  TCustomer,
  TCustomerSignInResult,
  TExtProductProjection,
  TExtProductProjectionPagedSearchResponse,
  TGetProductDiscountsParams,
  TGetProductProjectionByIdParams,
  TMyCartDraft,
  TMyCustomerChangePassword,
  TMyCustomerDraft,
  TMyCustomerSignin,
  TProductDiscount,
  TProductDiscountPagedQueryResponse,
  TProductProjection,
  TProductProjectionPagedSearchParams,
  TProductProjectionPagedSearchResponse,
  TQueryCategoriesParams,
  TUpdateMyCartParams,
  TUpdateMyCustomerParams,
} from '../types/types';
import { getMsgFromAxiosError } from '../utils/getMsgFromAxiosError';
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { getQueryString } from '../utils/getQueryString';
import { getPriceData } from '../utils/getPriceData';
import { authService, TokenRole } from '../services/authService';
import { getUserToken } from './authSlice';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

export type TAxiosBaseQueryParams = { httpService: HttpService };

export type TCustomError = {
  status?: number;
  data: string;
};

const createAxiosBaseQuery = ({
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
  baseQuery: createAxiosBaseQuery({ httpService }),
  tagTypes: ['Customer', 'Category', 'Product', 'Cart'],
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getMe: builder.query<TCustomer, void>({
      query: () => ({ url: `${projectKey}/me` }),
      providesTags: ['Customer'],
    }),

    signIn: builder.mutation<TCustomerSignInResult, TMyCustomerSignin>({
      queryFn: async (data, { dispatch, getState }, _extraOptions, fetchWithBQ) => {
        const { data: customerSignInResult, error: loginError } = await fetchWithBQ({
          url: `${projectKey}/me/login`,
          data,
          method: 'POST',
        });

        if (loginError) {
          return { error: loginError };
        }

        const authState = (getState() as RootState).auth;
        const { token, refreshToken, role } = authState;

        try {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await dispatch(getUserToken(data));

          if (role === TokenRole.anonymous) {
            authService.revokeTokens(token, refreshToken);
          }
        } catch (err: unknown) {
          return {
            error: {
              status: (err as { status?: number })?.status,
              data: getMsgFromAxiosError(err),
            },
          };
        }

        return { data: customerSignInResult as TCustomerSignInResult };
      },
      invalidatesTags: ['Customer', 'Cart'],
    }),

    signUp: builder.mutation<TCustomerSignInResult, TMyCustomerDraft>({
      query: (data: TMyCustomerDraft) => ({
        url: `${projectKey}/me/signup`,
        data,
        method: 'POST',
      }),
    }),

    updateMyCustomer: builder.mutation<TCustomer, TUpdateMyCustomerParams>({
      query: (data: TUpdateMyCustomerParams) => ({
        url: `${projectKey}/me`,
        data,
        method: 'POST',
      }),
      invalidatesTags: ['Customer'],
    }),

    changePassword: builder.mutation<TCustomer, TMyCustomerChangePassword>({
      query: (data: TMyCustomerChangePassword) => ({
        url: `${projectKey}/me/password`,
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

    getMyActiveCart: builder.query<TCart, void>({
      query: () => {
        return {
          url: `${projectKey}/me/active-cart`,
          method: 'GET',
        };
      },
      providesTags: ['Cart'],
    }),

    createMyCart: builder.mutation<TCart, TMyCartDraft>({
      query: (data: TCartDraft) => {
        return {
          url: `${projectKey}/me/carts`,
          data,
          method: 'POST',
        };
      },
      invalidatesTags: ['Cart'],
    }),

    updateMyCart: builder.mutation<TCart, TUpdateMyCartParams>({
      query: ({ cartId, data }: TUpdateMyCartParams) => {
        return {
          url: `${projectKey}/me/carts/${cartId}`,
          data,
          method: 'POST',
        };
      },
      invalidatesTags: ['Cart'],
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
  useGetMeQuery,
  useSignUpMutation,
  useQueryCategoriesQuery,
  useSearchProductProjectionsQuery,
  useGetProductDiscountsQuery,
  useGetProductProjectionByIdQuery,
  useUpdateMyCustomerMutation,
  useChangePasswordMutation,
  useGetMyActiveCartQuery,
  useLazyGetMyActiveCartQuery,
  useCreateMyCartMutation,
  useUpdateMyCartMutation,
  useSignInMutation,
} = storeApi;
