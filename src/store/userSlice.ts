import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService, TokenRole } from '../services/authService';
import { AppDispatch, AppGetState, RootState } from './store';
import { mutex } from '../services/apiClient';
import { isAxiosError } from 'axios';

export type TTokenData = {
  token: string;
  refreshToken: string;
};

export type TUserState = {
  role: TokenRole;
  basicToken: string;
  token: string;
  refreshToken: string;
  isAuthenticating: boolean;
  isUpdatingCart: boolean;
};

export type TUserSlice = typeof slice;

export const SLICE_NAME = 'user';

export const initialState: TUserState = {
  role: TokenRole.basic,
  basicToken: '',
  token: '',
  refreshToken: '',
  isAuthenticating: false,
  isUpdatingCart: false,
};

export const loadInitialState = (): TUserState => {
  const role = authService.getRoleFromLS();
  const { basicToken, token, refreshToken } = authService.getTokensFromLS();

  if (role === TokenRole.anonymous) {
    return {
      ...initialState,
      role: TokenRole.anonymous,
      token,
      refreshToken,
    };
  }

  if (role === TokenRole.user) {
    return {
      ...initialState,
      role: TokenRole.user,
      token,
      refreshToken,
    };
  }

  return { ...initialState, basicToken };
};

export const createUserSlice = (initialState: TUserState, sliceName: string) =>
  createSlice({
    initialState,
    name: sliceName,
    reducers: {
      basicTokenLoaded(state, action: PayloadAction<string>) {
        state.role = TokenRole.basic;
        state.basicToken = action.payload;
        state.token = '';
        state.refreshToken = '';
      },

      anonymousTokenLoaded(state, action: PayloadAction<TTokenData>) {
        state.role = TokenRole.anonymous;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      },

      userTokenLoaded(state, action: PayloadAction<TTokenData>) {
        state.role = TokenRole.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      },

      roleChangedToBasic(state) {
        state.role = TokenRole.basic;
        state.token = '';
        state.refreshToken = '';
      },

      tokenRefreshed(state, action: PayloadAction<string>) {
        state.token = action.payload;
      },

      authenticationStarted(state) {
        state.isAuthenticating = true;
      },

      authenticationEnded(state) {
        state.isAuthenticating = false;
      },

      cartUpdatingStarted(state) {
        state.isUpdatingCart = true;
      },

      cartUpdatingEnded(state) {
        state.isUpdatingCart = false;
      },
    },
  });

export const startTokenLoading = async () => {
  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
  }
  await mutex.acquire();
};

export const endTokenLoading = () => {
  mutex.release();
};

export const isIncorrectRefreshToken = (error: unknown) => {
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    if (statusCode && statusCode >= 400 && statusCode && statusCode < 500) {
      return true;
    }
  }
  return false;
};

export const tryToLoadToken = () => async (dispatch: AppDispatch, getState: AppGetState) => {
  await startTokenLoading();

  const { role, token, refreshToken } = getState().user;

  if (role === TokenRole.user || role === TokenRole.anonymous) {
    try {
      const tokenData = await authService.refreshToken(refreshToken);
      dispatch(tokenRefreshed(tokenData.access_token));
    } catch (e) {
      if (isIncorrectRefreshToken(e)) {
        await dispatch(logOut(true));
      }
    } finally {
      endTokenLoading();
    }
    return;
  }

  try {
    let validationResult;

    if (token) {
      validationResult = await authService.validateToken(token, TokenRole.basic);
    }

    if (!validationResult || !validationResult.active) {
      try {
        const tokenData = await authService.getBasicTokenData();
        dispatch(basicTokenLoaded(tokenData.access_token));
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  endTokenLoading();
  dispatch(authenticationEnded());
};

export const logOut =
  (isAuto?: boolean) => async (dispatch: AppDispatch, getState: AppGetState) => {
    if (!isAuto) {
      await startTokenLoading();
      dispatch(authenticationStarted());
    }

    const { token, refreshToken } = getState().user;

    authService.revokeTokens(token, refreshToken);
    authService.removeTokensFromLS({ isBasic: false, withRefreshToken: true });
    authService.saveRoleToLS(TokenRole.basic);
    dispatch(roleChangedToBasic());

    if (!isAuto) {
      endTokenLoading();
      dispatch(authenticationEnded());
    }
  };

export const getAccessToken = () => (_dispatch: AppDispatch, getState: AppGetState) => {
  const { role, basicToken, token } = getState().user;
  return role === TokenRole.basic ? basicToken : token;
};

export const slice = createUserSlice(loadInitialState(), SLICE_NAME);
export const selectUserRole = (state: RootState) => state[SLICE_NAME].role;
export const selectIsUpdatingCart = (state: RootState) => state[SLICE_NAME].isUpdatingCart;
export const selectIsAuthenticating = (state: RootState) => state[SLICE_NAME].isAuthenticating;

export const {
  anonymousTokenLoaded,
  authenticationEnded,
  authenticationStarted,
  basicTokenLoaded,
  cartUpdatingEnded,
  cartUpdatingStarted,
  roleChangedToBasic,
  tokenRefreshed,
  userTokenLoaded,
} = slice.actions;

export default slice.reducer;
