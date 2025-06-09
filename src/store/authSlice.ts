import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService, TBasicAuthData, TokenRole } from '../services/authService';
import { AppDispatch, AppGetState, RootState } from './store';
import { isAxiosError } from 'axios';
import { storeApi } from './storeApi';

export type TAuthState = {
  role: TokenRole;
  token: string;
  refreshToken: string;
  isLoading: boolean;
};

export type TBasicTokenData = {
  token: string;
};

export type TExtendedTokenData = {
  token: string;
  refreshToken: string;
};

export const getInitialState = (): TAuthState => {
  const basicToken = authService.getLSBasicToken() || '';
  const userToken = authService.getLSUserToken() || '';
  const userRefreshToken = authService.getLSUserRefreshToken() || '';
  const anonymousToken = authService.getLSAnonymousToken() || '';
  const anonymousRefreshToken = authService.getLSAnonymousRefreshToken() || '';

  return userToken
    ? {
        role: TokenRole.user,
        token: userToken,
        refreshToken: userRefreshToken,
        isLoading: false,
      }
    : anonymousToken
      ? {
          role: TokenRole.anonymous,
          token: anonymousToken,
          refreshToken: anonymousRefreshToken,
          isLoading: false,
        }
      : {
          role: TokenRole.basic,
          token: basicToken,
          refreshToken: '',
          isLoading: false,
        };
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
      basicTokenLoaded(state, action: PayloadAction<TBasicTokenData>) {
        state.role = TokenRole.basic;
        state.token = action.payload.token;
        state.refreshToken = '';
        state.isLoading = false;
      },
      userTokenLoaded(state, action: PayloadAction<TExtendedTokenData>) {
        state.role = TokenRole.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isLoading = false;
      },
      anonymousTokenLoaded(state, action: PayloadAction<TExtendedTokenData>) {
        state.role = TokenRole.anonymous;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isLoading = false;
      },
      tokenRefreshed(state, action: PayloadAction<TBasicTokenData>) {
        state.token = action.payload.token;
        state.isLoading = false;
      },
      roleChangedToBasic(state, action: PayloadAction<TBasicTokenData>) {
        state.role = TokenRole.basic;
        state.token = action.payload.token;
        state.refreshToken = '';
      },
    },
  });

const invalidateUserCache = () => (dispatch: AppDispatch) => {
  dispatch(storeApi.util.invalidateTags(['Customer']));
};

export const logIn = (authData: TBasicAuthData) => async (dispatch: AppDispatch) => {
  try {
    dispatch(tokenLoadingStarted());
    const tokenData = await authService.getUserTokenData(authData);
    dispatch(
      userTokenLoaded({
        token: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      })
    );
  } finally {
    dispatch(tokenLoadingEnded());
  }
};

export const getAnonymousToken = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(tokenLoadingStarted());
    const tokenData = await authService.getAnonymousTokenData();
    dispatch(
      anonymousTokenLoaded({
        token: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      })
    );
  } finally {
    dispatch(tokenLoadingEnded());
  }
};

export const logOut = () => (dispatch: AppDispatch, getState: AppGetState) => {
  const token = getState().auth.token;
  const refreshToken = getState().auth.refreshToken;
  authService.revokeToken(TokenRole.user, token, refreshToken);
  dispatch(roleChangedToBasic({ token: authService.getLSBasicToken() || '' }));
  dispatch(invalidateUserCache());
};

export const tryToLoadToken = () => async (dispatch: AppDispatch, getState: AppGetState) => {
  dispatch(tokenLoadingStarted());
  const { role, token, refreshToken } = getState().auth;

  const isIncorrectRefreshToken = (error: unknown) => {
    if (isAxiosError(error)) {
      const statusCode = error.response?.status;
      if (statusCode && statusCode >= 400 && statusCode && statusCode < 500) {
        return true;
      }
    }
    return false;
  };

  if (role === TokenRole.user || role === TokenRole.anonymous) {
    try {
      const tokenData = await authService.refreshToken(refreshToken, role);
      dispatch(tokenRefreshed({ token: tokenData.access_token }));
      return;
    } catch (e) {
      if (isIncorrectRefreshToken(e)) {
        dispatch(roleChangedToBasic({ token: authService.getLSBasicToken() || '' }));
      } else {
        dispatch(tokenLoadingEnded());
        return;
      }
    }
  }

  try {
    const validationResult = await authService.validateToken(token, TokenRole.basic);

    if (!validationResult.active) {
      try {
        const tokenData = await authService.getBasicTokenData();
        dispatch(basicTokenLoaded({ token: tokenData.access_token }));
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

export const slice = createAuthSlice(getInitialState(), SLICE_NAME);

export const {
  tokenLoadingStarted,
  tokenLoadingEnded,
  basicTokenLoaded,
  userTokenLoaded,
  anonymousTokenLoaded,
  tokenRefreshed,
  roleChangedToBasic,
} = slice.actions;

export default slice.reducer;
