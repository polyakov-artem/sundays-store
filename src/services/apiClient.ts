import axios, { AxiosInstance, HttpStatusCode, isAxiosError } from 'axios';
import { Mutex } from 'async-mutex';

export type TTryToLoadToken = () => Promise<void>;
export type TGetAccessToken = () => string;

export type TApiClientParams = {
  apiURL: string;
  mutex: Mutex;
};

export const ERROR_TRY_TO_LOAD_TOKEN_IS_NOT_SET =
  'apiClient.setTryToLoadToken method must be called first';
export const ERROR_GET_ACCESS_TOKEN_IS_NOT_SET =
  'apiClient.getAccessToken method must be called first';

export const apiURL = import.meta.env.VITE_CTP_API_URL;
export const mutex = new Mutex();

export class ApiClient {
  private tryToLoadToken?: TTryToLoadToken;
  private getAccessToken?: TGetAccessToken;
  private apiClient: AxiosInstance;
  private mutex: Mutex;

  constructor({ apiURL, mutex }: TApiClientParams) {
    this.mutex = mutex;

    this.apiClient = axios.create({
      baseURL: `${apiURL}/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.configureApiClient();
  }

  getClient() {
    if (!this.tryToLoadToken) throw new Error(ERROR_TRY_TO_LOAD_TOKEN_IS_NOT_SET);
    if (!this.getAccessToken) throw new Error(ERROR_GET_ACCESS_TOKEN_IS_NOT_SET);
    return this.apiClient;
  }

  setTryToLoadToken(tryToLoadToken: TTryToLoadToken) {
    this.tryToLoadToken = tryToLoadToken;
  }

  setGetAccessToken(getAccessToken: TGetAccessToken) {
    this.getAccessToken = getAccessToken;
  }

  private configureApiClient = () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    this.apiClient.interceptors.request.use(
      async function (config) {
        if (self.mutex.isLocked()) {
          await self.mutex.waitForUnlock();
        }

        config.headers.set('Authorization', `Bearer ${self.getAccessToken?.()}`);
        return config;
      },
      function (error: Error) {
        return Promise.reject(error);
      }
    );

    this.apiClient.interceptors.response.use(
      function (response) {
        return response;
      },

      async function (error: Error) {
        if (isAxiosError(error)) {
          const { response, config } = error;
          const statusCode = response?.status;

          if (
            config !== undefined &&
            !config.isRetry &&
            statusCode === HttpStatusCode.Unauthorized
          ) {
            config.isRetry = true;

            if (!self.mutex.isLocked()) {
              await self.tryToLoadToken?.();
            } else {
              await self.mutex.waitForUnlock();
            }

            return await self.apiClient(config);
          }
        }

        return Promise.reject(error);
      }
    );
  };
}

export const apiClient = new ApiClient({
  apiURL,
  mutex,
});
