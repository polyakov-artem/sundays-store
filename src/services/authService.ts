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
  userScope: string;
  anonymousScope: string;
  keyLSRole: string;
  keyLSbasicToken: string;
  keyLSToken: string;
  keyLSRefreshToken: string;
};

export type TBasicAuthData = {
  password: string;
  email: string;
};

export type TRemoveLSTokensParams = {
  isBasicToken: boolean;
  withRefreshToken?: boolean;
};

export type TSaveTokensToLSParams = {
  isBasic: boolean;
  token: string;
  refreshToken?: string;
};

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
const authURL = import.meta.env.VITE_CTP_AUTH_URL;

export const KEY_LS_ROLE = 'role';
export const KEY_LS_BASIC_TOKEN = 'basic_token';
export const KEY_LS_TOKEN = 'token';
export const KEY_LS_REFRESH_TOKEN = 'refresh_token';

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

export const isIncorrectRefreshToken = (error: unknown) => {
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    if (statusCode && statusCode >= 400 && statusCode && statusCode < 500) {
      return true;
    }
  }
  return false;
};

export class AuthService {
  private authClient: AxiosInstance;
  private localStorageService: TLocalStorageService;
  private projectKey: string;
  private clientSecret: string;
  private clientId: string;
  private authURL: string;
  private basicScope: string;
  private userScope: string;
  private anonymousScope: string;
  private keyLSRole: string;
  private keyLSbasicToken: string;
  private keyLSToken: string;
  private keyLSRefreshToken: string;

  constructor(params: TAuthServiceParams) {
    this.localStorageService = params.localStorageService;
    this.projectKey = params.projectKey;
    this.clientSecret = params.clientSecret;
    this.clientId = params.clientId;
    this.authURL = params.authURL;
    this.basicScope = params.basicScope;
    this.userScope = params.userScope;
    this.anonymousScope = params.anonymousScope;
    this.keyLSRole = params.keyLSRole;
    this.keyLSbasicToken = params.keyLSbasicToken;
    this.keyLSToken = params.keyLSToken;
    this.keyLSRefreshToken = params.keyLSRefreshToken;

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
    this.saveTokensToLS({
      isBasic: true,
      token: tokenData.access_token,
    });
    this.saveRoleToLS(TokenRole.basic);
    this.removeLSTokens({ isBasicToken: false });
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

    this.saveTokensToLS({
      isBasic: false,
      token: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    });
    this.saveRoleToLS(TokenRole.user);

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

    this.saveTokensToLS({
      isBasic: false,
      token: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    });
    this.saveRoleToLS(TokenRole.anonymous);

    return tokenData;
  };

  refreshToken = async (refreshToken: string): Promise<TFetchedTokenData> => {
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
      this.saveTokensToLS({ isBasic: false, token: tokenData.access_token, refreshToken });

      return tokenData;
    } catch (e: unknown) {
      if (isIncorrectRefreshToken(e)) {
        this.removeLSTokens({ isBasicToken: false });
        this.saveRoleToLS(TokenRole.basic);
      }
      throw e;
    }
  };

  validateToken = async (token: string): Promise<TTokenValidationResult> => {
    const data = new URLSearchParams();
    data.append('token', token);

    const response = await this.authClient.post<TTokenValidationResult>('introspect', data, {
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
    });

    const validationResult = response.data;
    return validationResult;
  };

  saveRoleToLS = (role: TokenRole) => {
    this.localStorageService.saveData(this.keyLSRole, role);
  };

  getLSRole = () => {
    return this.localStorageService.getData<TokenRole>(this.keyLSRole);
  };

  getLSTokens = () => {
    return {
      basicToken: this.localStorageService.getData<string>(this.keyLSbasicToken) || '',
      token: this.localStorageService.getData<string>(this.keyLSToken) || '',
      refreshToken: this.localStorageService.getData<string>(this.keyLSRefreshToken) || '',
    };
  };

  saveTokensToLS = ({ isBasic, token, refreshToken }: TSaveTokensToLSParams) => {
    if (isBasic) {
      this.localStorageService.saveData(this.keyLSbasicToken, token);
    } else {
      this.localStorageService.saveData(this.keyLSToken, token);
      this.localStorageService.saveData(this.keyLSRefreshToken, refreshToken);
    }
  };

  removeLSTokens = ({ isBasicToken, withRefreshToken = true }: TRemoveLSTokensParams) => {
    if (isBasicToken) {
      this.localStorageService.removeData(this.keyLSbasicToken);
    } else {
      this.localStorageService.removeData(this.keyLSToken);

      if (withRefreshToken) {
        this.localStorageService.removeData(this.keyLSRefreshToken);
      }
    }
  };

  revokeTokens = (...tokens: string[]): void => {
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
}

export const authService = new AuthService({
  localStorageService,
  projectKey,
  clientSecret,
  clientId,
  authURL,
  basicScope,
  userScope,
  anonymousScope,
  keyLSRole: KEY_LS_ROLE,
  keyLSbasicToken: KEY_LS_BASIC_TOKEN,
  keyLSToken: KEY_LS_TOKEN,
  keyLSRefreshToken: KEY_LS_REFRESH_TOKEN,
});
