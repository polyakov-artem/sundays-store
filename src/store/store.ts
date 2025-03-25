import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';

export const createStore = () =>
  configureStore({
    reducer: {
      auth,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
  });

export const store = createStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppGetState = typeof store.getState;
