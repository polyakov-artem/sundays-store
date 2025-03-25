import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import { storeApi } from './storeApi';

export const createStore = () =>
  configureStore({
    reducer: {
      auth,
      [storeApi.reducerPath]: storeApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storeApi.middleware),
  });

export const store = createStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppGetState = typeof store.getState;
