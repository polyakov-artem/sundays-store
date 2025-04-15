import { createSlice } from '@reduxjs/toolkit';
import { CountryCode, CountryLocale } from '../types/types';
import { RootState } from './store';

type TSettingsState = {
  country: CountryCode;
};

const initialState = {
  country: CountryCode.US,
};

export const SLICE_NAME = 'settings';

export const createAuthSlice = (initialState: TSettingsState, sliceName: string) =>
  createSlice({
    initialState,
    name: sliceName,
    reducers: {},
  });

export const slice = createAuthSlice(initialState, SLICE_NAME);
export const selectLocale = (state: RootState) => CountryLocale[state[SLICE_NAME].country];

export default slice.reducer;
