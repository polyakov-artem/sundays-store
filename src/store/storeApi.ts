import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig } from 'axios';
import { httpService, HttpService } from '../services/httpService';
import { AppGetState } from './store';
import { TCustomer, TCustomerSignInResult, TMyCustomerDraft } from '../types/types';
import { getMsgFromAxiosError } from '../utils/getMsgFromAxiosError';

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
  tagTypes: ['Customer'],
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
  }),
});

export const { useGetMeQuery, useSignUpMutation } = storeApi;
