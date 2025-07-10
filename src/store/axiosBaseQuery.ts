import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig } from 'axios';
import { apiClient, ApiClient } from '../services/apiClient';
import { getCustomError } from '../utils/getCustomError';

export type TAxiosBaseQueryParams = { apiClient: ApiClient };

export type TCustomError = {
  status?: number;
  data: string;
};

export type TQueryResponse<T> =
  | {
      data: T;
      error?: undefined;
    }
  | {
      data?: undefined;
      error: TCustomError;
    };

const createAxiosBaseQuery = ({
  apiClient,
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
  return async ({ url, method, data, params, headers }) => {
    const client = apiClient.getClient();

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
    } catch (error: unknown) {
      return { error: getCustomError(error) };
    }
  };
};

export const axiosBaseQuery = createAxiosBaseQuery({ apiClient });
