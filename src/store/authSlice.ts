import { createSlice } from '@reduxjs/toolkit';
import { authService, TBasicAuthData, TokenRole } from '../services/authService';
import { mutex } from '../services/httpService';
import { AppDispatch, AppGetState, RootState } from './store';
import { isAxiosError } from 'axios';
import { storeApi } from './storeApi';

type TAuthState = {
  role: TokenRole;
  tokens: Record<TokenRole, string>;
  refreshTokens: {
    [TokenRole.user]: string;
  };
  isLoading: boolean;
};

const initialState = {
  role: TokenRole.basic,
  tokens: {
    [TokenRole.basic]: '',
    [TokenRole.user]: '',
  },
  refreshTokens: {
    [TokenRole.user]: '',
  },
  isLoading: false,
};

export type TTokensLoadedFromLSPayload = {
  userToken: string;
  userRefreshToken: string;
  basicToken: string;
  role: TokenRole;
};

export const SLICE_NAME = 'auth';

export const createAuthSlice = (initialState: TAuthState, sliceName: string) =>
  createSlice({
    initialState,
    name: sliceName,
    reducers: {
      tokenLoadingStarted(state) {
        state.isLoading = true;
      },
      tokenLoadingEnded(state) {
        state.isLoading = false;
      },
      lsTokensLoaded(
        state,
        action: {
          payload: TTokensLoadedFromLSPayload;
        }
      ) {
        const { userToken, userRefreshToken, role, basicToken } = action.payload;
        state.role = role;
        state.tokens[TokenRole.basic] = basicToken;
        state.tokens[TokenRole.user] = userToken;
        state.refreshTokens[TokenRole.user] = userRefreshToken;
      },
      basicTokenLoaded(state, action: { payload: { basicToken: string } }) {
        const role = TokenRole.basic;
        state.role = role;
        state.tokens[role] = action.payload.basicToken;
        state.tokens[TokenRole.user] = '';
        state.refreshTokens[TokenRole.user] = '';
        state.isLoading = false;
      },
      userTokenLoaded(state, action: { payload: { userToken: string; userRefreshToken: string } }) {
        const role = TokenRole.user;
        state.role = role;
        state.tokens[role] = action.payload.userToken;
        state.refreshTokens[role] = action.payload.userRefreshToken;
        state.isLoading = false;
      },
      userTokenRefreshed(state, action: { payload: { userToken: string } }) {
        state.tokens[TokenRole.user] = action.payload.userToken;
        state.isLoading = false;
      },
      userLoggedOut(state) {
        state.role = TokenRole.basic;
        state.tokens[TokenRole.user] = '';
        state.refreshTokens[TokenRole.user] = '';
      },
    },
  });

export const logIn = (authData: TBasicAuthData) => async (dispatch: AppDispatch) => {
  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
  }

  const release = await mutex.acquire();

  try {
    dispatch(tokenLoadingStarted());
    const tokenData = await authService.getUserTokenData(authData);
    dispatch(
      userTokenLoaded({
        userToken: tokenData.access_token,
        userRefreshToken: tokenData.refresh_token,
      })
    );
    dispatch(storeApi.util.invalidateTags(['Customer']));
  } finally {
    dispatch(tokenLoadingEnded());
    release();
  }
};

export const logOut = () => (dispatch: AppDispatch, getState: AppGetState) => {
  const userToken = getState().auth.tokens.user;
  const userRefreshToken = getState().auth.refreshTokens[TokenRole.user];
  authService.revokeToken(TokenRole.user, userToken, userRefreshToken);
  dispatch(userLoggedOut());
  dispatch(storeApi.util.invalidateTags(['Customer']));
};

export const loadInitialTokens = () => (dispatch: AppDispatch) => {
  const userToken = authService.getLSUserToken() || '';
  const userRefreshToken = authService.getLSUserRefreshToken() || '';
  const basicToken = authService.getLSBasicToken() || '';

  const role = userToken && userRefreshToken ? TokenRole.user : TokenRole.basic;
  dispatch(lsTokensLoaded({ userToken, userRefreshToken, basicToken, role }));
};

export const tryToLoadToken = () => async (dispatch: AppDispatch, getState: AppGetState) => {
  dispatch(tokenLoadingStarted());
  const authState = getState().auth;
  const role = authState.role;
  const userRefreshToken = authState.refreshTokens[TokenRole.user];
  const basicToken = authState.tokens[TokenRole.basic];

  const isIncorrectRefreshToken = (error: unknown) => {
    if (isAxiosError(error)) {
      const statusCode = error.response?.status || 0;
      if (statusCode >= 400 && statusCode && statusCode < 500) {
        return true;
      }
    }
    return false;
  };

  if (role === TokenRole.user) {
    try {
      const tokenData = await authService.refreshToken(userRefreshToken);
      dispatch(userTokenRefreshed({ userToken: tokenData.access_token }));
      return;
    } catch (e) {
      if (isIncorrectRefreshToken(e)) {
        dispatch(logOut());
      } else {
        dispatch(tokenLoadingEnded());
        return;
      }
    }
  }

  try {
    const validationResult = await authService.validateToken(basicToken, TokenRole.basic);

    if (!validationResult.active) {
      try {
        const tokenData = await authService.getBasicTokenData();
        dispatch(basicTokenLoaded({ basicToken: tokenData.access_token }));
        return;
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
  dispatch(tokenLoadingEnded());
};

export const selectUserRole = (state: RootState) => state[SLICE_NAME].role;
export const selectIsLoggedIn = (state: RootState) => state[SLICE_NAME].role === TokenRole.user;

export const slice = createAuthSlice(initialState, SLICE_NAME);

export const {
  tokenLoadingStarted,
  tokenLoadingEnded,
  lsTokensLoaded,
  basicTokenLoaded,
  userTokenRefreshed,
  userTokenLoaded,
  userLoggedOut,
} = slice.actions;

export default slice.reducer;
