import axios, { AxiosInstance, HttpStatusCode, isAxiosError } from 'axios';
import { AppDispatch, AppGetState } from '../store/store';
import {
  basicTokenLoaded,
  tokenLoadingEnded,
  tokenLoadingStarted,
  userTokenRefreshed,
  roleChangedToBasic,
} from '../store/authSlice';
import { AuthService, authService, TokenRole } from './authService';
import { Mutex } from 'async-mutex';

export type THttpServiceParams = {
  apiURL: string;
  authService: AuthService;
};

export const DISPATCH_IS_NOT_SET_MESSAGE = 'httpService.setDispatchFn method must be called first';
export const GET_STATE_IS_NOT_SET_MESSAGE = 'httpService.setGetStateFn method must be called first';

export const apiURL = import.meta.env.VITE_CTP_API_URL;
export const mutex = new Mutex();

export class HttpService {
  private authService: AuthService;
  private dispatch?: AppDispatch;
  private getState?: AppGetState;
  private client: AxiosInstance;

  constructor({ apiURL, authService }: THttpServiceParams) {
    this.client = axios.create({
      baseURL: `${apiURL}/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.authService = authService;
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

  private isIncorrectRefreshToken = (error: unknown) => {
    if (isAxiosError(error)) {
      const statusCode = error.response?.status || 0;
      if (statusCode >= 400 && statusCode && statusCode < 500) {
        return true;
      }
    }
    return false;
  };

  private async tryToLoadToken() {
    this.dispatch?.(tokenLoadingStarted());
    const authState = this.getState!().auth;
    const role = authState.role;
    const userRefreshToken = authState.refreshTokens[TokenRole.user];
    const basicToken = authState.tokens[TokenRole.basic];

    if (role === TokenRole.user) {
      try {
        const tokenData = await this.authService.refreshToken(userRefreshToken);
        this.dispatch?.(userTokenRefreshed({ userToken: tokenData.access_token }));
        return;
      } catch (e) {
        if (this.isIncorrectRefreshToken(e)) {
          this.dispatch?.(roleChangedToBasic());
        } else {
          this.dispatch?.(tokenLoadingEnded());
          return;
        }
      }
    }

    try {
      const validationResult = await this.authService.validateToken(basicToken, TokenRole.basic);

      if (!validationResult.active) {
        try {
          const tokenData = await this.authService.getBasicTokenData();
          this.dispatch?.(basicTokenLoaded({ basicToken: tokenData.access_token }));
          return;
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
    this.dispatch?.(tokenLoadingEnded());
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
              await self.tryToLoadToken();
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
  authService,
});
