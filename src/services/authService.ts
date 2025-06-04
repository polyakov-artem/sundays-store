import axios, { AxiosInstance, isAxiosError } from 'axios';
import { localStorageService, TLocalStorageService } from './localStorageService';

export enum TokenRole {
  basic = 'basic',
  user = 'user',
  anonymous = 'anonymous',
}

export type TFetchedTokenData = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

export type TFetchedExtendedTokenData = TFetchedTokenData & {
  refresh_token: string;
};

export type TTokenValidationResult =
  | {
      active: true;
      scope: string;
      exp: number;
      client_id: string;
    }
  | { active: false };

export type TAuthServiceParams = {
  localStorageService: TLocalStorageService;
  projectKey: string;
  clientSecret: string;
  clientId: string;
  authURL: string;
  basicScope: string;
  basicTokenKey: string;
  userScope: string;
  userTokenKey: string;
  userRefreshTokenKey: string;
  anonymousScope: string;
  anonymousTokenKey: string;
  anonymousRefreshTokenKey: string;
};

export type TBasicAuthData = {
  password: string;
  email: string;
};

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
const authURL = import.meta.env.VITE_CTP_AUTH_URL;

export const LS_BASIC_TOKEN_KEY = 'basic_token';
export const LS_USER_TOKEN_KEY = 'user_token';
export const LS_USER_REFRESH_TOKEN_KEY = 'refresh_token';
export const LS_ANONYMOUS_TOKEN_KEY = 'anonymous_token';
export const LS_ANONYMOUS_REFRESH_TOKEN_KEY = 'anonymous_refresh_token';

export const BASIC_SCOPE_KEYS = [
  'view_categories',
  'view_published_products',
  'view_products',
  'create_anonymous_token',
  'manage_my_profile',
];

export const ANONYMOUS_SCOPE_KEYS = [
  'view_categories',
  'view_published_products',
  'view_products',
  'manage_my_orders',
  'manage_my_profile',
];

export const USER_SCOPE_KEYS = [
  'view_categories',
  'view_published_products',
  'view_products',
  'manage_my_business_units',
  'manage_my_orders',
  'manage_my_payments',
  'manage_my_profile',
  'manage_my_quote_requests',
  'manage_my_quotes',
  'manage_my_shopping_lists',
];

export const createScope = (scopeKeys: string[]): string =>
  scopeKeys.map((key) => `${key}:${projectKey}`).join(' ');

export const basicScope = createScope(BASIC_SCOPE_KEYS);
export const userScope = createScope(USER_SCOPE_KEYS);
export const anonymousScope = createScope(ANONYMOUS_SCOPE_KEYS);

export class AuthService {
  private authClient: AxiosInstance;
  private localStorageService: TLocalStorageService;
  private projectKey: string;
  private clientSecret: string;
  private clientId: string;
  private authURL: string;
  private basicScope: string;
  private basicTokenKey: string;
  private userScope: string;
  private userTokenKey: string;
  private userRefreshTokenKey: string;
  private anonymousScope: string;
  private anonymousTokenKey: string;
  private anonymousRefreshTokenKey: string;

  constructor(params: TAuthServiceParams) {
    this.localStorageService = params.localStorageService;
    this.projectKey = params.projectKey;
    this.clientSecret = params.clientSecret;
    this.clientId = params.clientId;
    this.authURL = params.authURL;
    this.basicScope = params.basicScope;
    this.basicTokenKey = params.basicTokenKey;
    this.userScope = params.userScope;
    this.userTokenKey = params.userTokenKey;
    this.userRefreshTokenKey = params.userRefreshTokenKey;
    this.anonymousScope = params.anonymousScope;
    this.anonymousTokenKey = params.anonymousTokenKey;
    this.anonymousRefreshTokenKey = params.anonymousRefreshTokenKey;

    this.authClient = axios.create({
      baseURL: `${this.authURL}/oauth/`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  getBasicTokenData = async (): Promise<TFetchedTokenData> => {
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('scope', this.basicScope);

    const response = await this.authClient.post<TFetchedTokenData>('token', data, {
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
    });

    const tokenData = response.data;
    this.saveBasicTokenToLS(tokenData.access_token);
    return tokenData;
  };

  getUserTokenData = async ({
    email,
    password,
  }: TBasicAuthData): Promise<TFetchedExtendedTokenData> => {
    const data = new URLSearchParams();
    data.append('grant_type', 'password');
    data.append('username', email);
    data.append('password', password);
    data.append('scope', this.userScope);

    const response = await this.authClient.post<TFetchedExtendedTokenData>(
      `${this.projectKey}/customers/token`,
      data,
      {
        auth: {
          username: this.clientId,
          password: this.clientSecret,
        },
      }
    );

    const tokenData = response.data;

    this.saveUserTokenToLS(tokenData.access_token);
    this.saveUserRefreshTokenToLS(tokenData.refresh_token);

    return tokenData;
  };

  getAnonymousTokenData = async (): Promise<TFetchedExtendedTokenData> => {
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('scope', this.anonymousScope);

    const response = await this.authClient.post<TFetchedExtendedTokenData>(
      `${this.projectKey}/anonymous/token`,
      data,
      {
        auth: {
          username: this.clientId,
          password: this.clientSecret,
        },
      }
    );

    const tokenData = response.data;

    this.saveAnonymousTokenToLS(tokenData.access_token);
    this.saveAnonymousRefreshTokenToLS(tokenData.refresh_token);

    return tokenData;
  };

  refreshToken = async (
    refreshToken: string,
    role: Omit<TokenRole, TokenRole.basic>
  ): Promise<TFetchedTokenData> => {
    const data = new URLSearchParams();
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', refreshToken);

    try {
      const response = await this.authClient.post<TFetchedTokenData>('token', data, {
        auth: {
          username: this.clientId,
          password: this.clientSecret,
        },
      });

      const tokenData = response.data;
      if (role === TokenRole.user) {
        this.saveUserTokenToLS(tokenData.access_token);
      } else if (role === TokenRole.anonymous) {
        this.saveAnonymousTokenToLS(tokenData.access_token);
      }

      return tokenData;
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        if (e.response?.status === 400) {
          if (role === TokenRole.user) {
            this.removeLSUserToken();
            this.removeLSUserRefreshToken();
          } else if (role === TokenRole.anonymous) {
            this.removeLSAnonymousToken();
            this.removeLSAnonymousRefreshToken();
          }
        }
      }
      throw e;
    }
  };

  validateToken = async (token: string, role: TokenRole): Promise<TTokenValidationResult> => {
    const data = new URLSearchParams();
    data.append('token', token);

    const response = await this.authClient.post<TTokenValidationResult>('introspect', data, {
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
    });

    const validationResult = response.data;

    if (!validationResult.active) {
      if (role === TokenRole.basic) {
        this.removeLSBasicToken();
      } else if (role === TokenRole.user) {
        this.removeLSUserToken();
      } else if (role === TokenRole.anonymous) {
        this.removeLSAnonymousToken();
      }
    }

    return validationResult;
  };

  revokeToken = (role: TokenRole, ...tokens: string[]): void => {
    if (role === TokenRole.basic) {
      this.removeLSBasicToken();
    } else if (role === TokenRole.user) {
      this.removeLSUserToken();
      this.removeLSUserRefreshToken();
    } else if (role === TokenRole.anonymous) {
      this.removeLSAnonymousToken();
      this.removeLSAnonymousRefreshToken();
    }

    tokens.forEach((tokenString) => {
      const data = new URLSearchParams();
      data.append('token', tokenString);

      void this.authClient.post<void>('token/revoke', data, {
        auth: {
          username: this.clientId,
          password: this.clientSecret,
        },
      });
    });
  };

  saveBasicTokenToLS = (token: string) =>
    this.localStorageService.saveData(this.basicTokenKey, token);
  saveUserTokenToLS = (token: string) =>
    this.localStorageService.saveData(this.userTokenKey, token);
  saveUserRefreshTokenToLS = (token: string) =>
    this.localStorageService.saveData(this.userRefreshTokenKey, token);
  saveAnonymousTokenToLS = (token: string) =>
    this.localStorageService.saveData(this.anonymousTokenKey, token);
  saveAnonymousRefreshTokenToLS = (token: string) =>
    this.localStorageService.saveData(this.anonymousRefreshTokenKey, token);

  getLSBasicToken = () => this.localStorageService.getData<string>(this.basicTokenKey);
  getLSUserToken = () => this.localStorageService.getData<string>(this.userTokenKey);
  getLSUserRefreshToken = () => this.localStorageService.getData<string>(this.userRefreshTokenKey);
  getLSAnonymousToken = () => this.localStorageService.getData<string>(this.anonymousTokenKey);
  getLSAnonymousRefreshToken = () =>
    this.localStorageService.getData<string>(this.anonymousRefreshTokenKey);

  removeLSBasicToken = () => this.localStorageService.removeData(this.basicTokenKey);
  removeLSUserToken = () => this.localStorageService.removeData(this.userTokenKey);
  removeLSUserRefreshToken = () => this.localStorageService.removeData(this.userRefreshTokenKey);
  removeLSAnonymousToken = () => this.localStorageService.removeData(this.anonymousTokenKey);
  removeLSAnonymousRefreshToken = () =>
    this.localStorageService.removeData(this.anonymousRefreshTokenKey);
}

export const authService = new AuthService({
  localStorageService,
  projectKey,
  clientSecret,
  clientId,
  authURL,
  basicScope,
  basicTokenKey: LS_BASIC_TOKEN_KEY,
  userScope,
  userTokenKey: LS_USER_TOKEN_KEY,
  userRefreshTokenKey: LS_USER_REFRESH_TOKEN_KEY,
  anonymousScope,
  anonymousTokenKey: LS_ANONYMOUS_TOKEN_KEY,
  anonymousRefreshTokenKey: LS_ANONYMOUS_REFRESH_TOKEN_KEY,
});
