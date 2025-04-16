import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import auth from './authSlice';
import settings from './settingsSlice';
import { storeApi } from './storeApi';

export const createStore = () =>
  configureStore({
    reducer: {
      auth,
      settings,
      [storeApi.reducerPath]: storeApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storeApi.middleware),
  });

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
