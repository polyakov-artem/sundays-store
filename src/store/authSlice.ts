import { createSlice } from '@reduxjs/toolkit';
import { authService, TokenRole } from '../services/authService';
import { Mutex } from 'async-mutex';
import { AppDispatch, AppGetState, RootState } from './store';

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

export const mutex = new Mutex();

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
        state.isLoading = false;
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
      roleChangedToBasic(state) {
        state.role = TokenRole.basic;
        state.tokens[TokenRole.user] = '';
        state.refreshTokens[TokenRole.user] = '';
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

export const slice = createAuthSlice(initialState, SLICE_NAME);

export const logOut = () => (dispatch: AppDispatch, getState: AppGetState) => {
  const userToken = getState().auth.tokens.user;
  const userRefreshToken = getState().auth.refreshTokens[TokenRole.user];
  authService.revokeToken(TokenRole.user, userToken, userRefreshToken);
  dispatch(userLoggedOut());
};

export const loadInitialTokens = () => (dispatch: AppDispatch) => {
  dispatch(tokenLoadingStarted());
  let userToken = '';
  let basicToken = '';
  let userRefreshToken = '';

  try {
    userToken = authService.getLSUserToken() || '';
  } catch {
    // ignore
  }

  try {
    userRefreshToken = authService.getLSUserRefreshToken() || '';
  } catch {
    userToken = '';
  }

  try {
    basicToken = authService.getLSBasicToken() || '';
  } catch {
    // ignore
  }

  const role = userToken && userRefreshToken ? TokenRole.user : TokenRole.basic;
  dispatch(lsTokensLoaded({ userToken, userRefreshToken, basicToken, role }));
};

export const selectUserRole = (state: RootState) => state[SLICE_NAME].role;
export const selectIsLoggedIn = (state: RootState) => state[SLICE_NAME].role === TokenRole.user;

export const {
  tokenLoadingStarted,
  tokenLoadingEnded,
  lsTokensLoaded,
  basicTokenLoaded,
  userTokenRefreshed,
  userTokenLoaded,
  roleChangedToBasic,
  userLoggedOut,
} = slice.actions;

export default slice.reducer;
