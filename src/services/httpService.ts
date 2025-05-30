import axios, { AxiosInstance, HttpStatusCode, isAxiosError } from 'axios';
import { AppDispatch, AppGetState } from '../store/store';
import { tryToLoadToken } from '../store/authSlice';
import { Mutex } from 'async-mutex';

export type THttpServiceParams = {
  apiURL: string;
};

export const DISPATCH_IS_NOT_SET_MESSAGE = 'httpService.setDispatchFn method must be called first';
export const GET_STATE_IS_NOT_SET_MESSAGE = 'httpService.setGetStateFn method must be called first';

export const apiURL = import.meta.env.VITE_CTP_API_URL;
export const mutex = new Mutex();

export class HttpService {
  private dispatch?: AppDispatch;
  private getState?: AppGetState;
  private client: AxiosInstance;

  constructor({ apiURL }: THttpServiceParams) {
    this.client = axios.create({
      baseURL: `${apiURL}/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.configure();
  }

  getClient() {
    if (!this.dispatch) throw new Error(DISPATCH_IS_NOT_SET_MESSAGE);
    if (!this.getState) throw new Error(GET_STATE_IS_NOT_SET_MESSAGE);
    return this.client;
  }

  setDispatchFn(dispatch: AppDispatch) {
    if (!this.dispatch) {
      this.dispatch = dispatch;
    }
  }

  setGetStateFn(getState: AppGetState) {
    if (!this.getState) {
      this.getState = getState;
    }
  }

  private configure = () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    this.client.interceptors.request.use(
      async function (config) {
        if (mutex.isLocked()) {
          await mutex.waitForUnlock();
        }

        const authState = self.getState!().auth;
        const accessToken = authState.tokens[authState.role];

        config.headers.set('Authorization', `Bearer ${accessToken}`);
        return config;
      },
      function (error: Error) {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
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
            if (!mutex.isLocked()) {
              const release = await mutex.acquire();
              await self.dispatch?.(tryToLoadToken());
              release();
            } else {
              await mutex.waitForUnlock();
            }
            return await self.client(config);
          }
        }

        return Promise.reject(error);
      }
    );
  };
}

export const httpService = new HttpService({
  apiURL,
});
