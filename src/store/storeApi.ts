import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { httpService, HttpService } from '../services/httpService';
import { AppGetState } from './store';
import { TCustomer, TCustomerSignInResult, TMyCustomerDraft } from '../types/types';
import { getMsgFromAxiosError } from '../utils/getMsgFromAxiosError';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

export type TAxiosBaseQueryParams = { httpService: HttpService };

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
  {
    status?: number;
    data: unknown;
  }
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
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err?.status,
          data: getMsgFromAxiosError(err),
        },
      };
    }
  };
};

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: axiosBaseQuery({ httpService }),
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    getMe: builder.query<TCustomer, void>({
      query: () => ({ url: `${projectKey}/me` }),
      providesTags: (result) =>
        result ? [{ type: 'Customer' as const, id: result.id }, 'Customer'] : ['Customer'],
    }),
    signUp: builder.mutation<TCustomerSignInResult, TMyCustomerDraft>({
      query: (data: TMyCustomerDraft) => ({
        url: `${projectKey}/me/signup`,
        data,
        method: 'POST',
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Customer' as const, id: result.id }, 'Customer'] : ['Customer'],
    }),
  }),
});

export const { useGetMeQuery, useSignUpMutation } = storeApi;
