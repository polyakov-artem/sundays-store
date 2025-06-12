import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  authService,
  isIncorrectRefreshToken,
  TBasicAuthData,
  TokenRole,
} from '../services/authService';
import { AppDispatch, AppGetState, RootState } from './store';
import { storeApi } from './storeApi';
import { mutex } from '../services/httpService';

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
  const role = authService.getLSRole() || TokenRole.basic;
  const { basicToken, token, refreshToken } = authService.getLSTokens();

  if (role === TokenRole.anonymous || role === TokenRole.user) {
    return {
      role,
      token,
      refreshToken,
      isLoading: false,
    };
  }

  return {
    role: TokenRole.basic,
    token: basicToken,
    refreshToken,
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
      },
      userTokenLoaded(state, action: PayloadAction<TExtendedTokenData>) {
        state.role = TokenRole.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      },
      anonymousTokenLoaded(state, action: PayloadAction<TExtendedTokenData>) {
        state.role = TokenRole.anonymous;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      },
      tokenRefreshed(state, action: PayloadAction<TBasicTokenData>) {
        state.token = action.payload.token;
      },
      roleChangedToBasic(state, action: PayloadAction<TBasicTokenData>) {
        state.role = TokenRole.basic;
        state.token = action.payload.token;
        state.refreshToken = '';
      },
    },
  });

export const startTokenLoading = () => async (dispatch: AppDispatch) => {
  dispatch(tokenLoadingStarted());
  await mutex.acquire();
};

export const endTokenLoading = () => (dispatch: AppDispatch) => {
  dispatch(tokenLoadingEnded());
  mutex.release();
};

export const getUserToken = (authData: TBasicAuthData) => async (dispatch: AppDispatch) => {
  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
  }

  await dispatch(startTokenLoading());

  try {
    const tokenData = await authService.getUserTokenData(authData);
    dispatch(
      userTokenLoaded({
        token: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      })
    );
  } finally {
    dispatch(endTokenLoading());
  }
};

export const getAnonymousToken = () => async (dispatch: AppDispatch) => {
  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
  }

  await dispatch(startTokenLoading());

  try {
    const tokenData = await authService.getAnonymousTokenData();
    dispatch(
      anonymousTokenLoaded({
        token: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      })
    );
  } finally {
    dispatch(endTokenLoading());
  }
};

export const invalidateUserCache = () => (dispatch: AppDispatch) => {
  dispatch(storeApi.util.invalidateTags(['Customer', 'Cart']));
};

export const changeRoleToBasic =
  (revokeTokens?: boolean) => (dispatch: AppDispatch, getState: AppGetState) => {
    if (revokeTokens) {
      const { token, refreshToken } = getState().auth;
      authService.revokeTokens(token, refreshToken);
    }

    authService.removeLSTokens({ isBasicToken: false });
    dispatch(roleChangedToBasic({ token: authService.getLSTokens().basicToken }));
    authService.saveRoleToLS(TokenRole.basic);
  };

export const logOut = () => async (dispatch: AppDispatch) => {
  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
  }

  await dispatch(startTokenLoading());
  dispatch(changeRoleToBasic(true));
  dispatch(endTokenLoading());
  dispatch(invalidateUserCache());
};

export const tryToLoadToken = () => async (dispatch: AppDispatch, getState: AppGetState) => {
  await dispatch(startTokenLoading());
  const { role, token, refreshToken } = getState().auth;

  if (role === TokenRole.user || role === TokenRole.anonymous) {
    try {
      const tokenData = await authService.refreshToken(refreshToken);
      dispatch(tokenRefreshed({ token: tokenData.access_token }));
      dispatch(endTokenLoading());
      return;
    } catch (e) {
      if (!isIncorrectRefreshToken(e)) {
        dispatch(endTokenLoading());
        return;
      } else {
        dispatch(changeRoleToBasic());
      }
    }
  }

  try {
    const validationResult = await authService.validateToken(token);

    if (!validationResult.active) {
      try {
        const tokenData = await authService.getBasicTokenData();
        dispatch(basicTokenLoaded({ token: tokenData.access_token }));
        dispatch(endTokenLoading());
        return;
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  dispatch(endTokenLoading());
};

export const selectUserRole = (state: RootState) => state[SLICE_NAME].role;

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
