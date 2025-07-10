import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import user from './userSlice';
import settings from './settingsSlice';
import { storeApi } from './storeApi';
import { userApi } from './userApi';

export const createStore = () => {
  return configureStore({
    reducer: {
      user,
      settings,
      [storeApi.reducerPath]: storeApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware, storeApi.middleware),
  });
};

export const store = createStore();

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppGetState = AppStore['getState'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  undefined,
  Action
>;
