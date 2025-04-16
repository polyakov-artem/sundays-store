import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CountryCode, CountryLocale } from '../types/types';
import { RootState } from './store';
import { localStorageService } from '../services/localStorageService';

export type TSettingsState = {
  countryCode: CountryCode;
};

export const COUNTRY_CODE_LS_KEY = 'country_code';
export const SLICE_NAME = 'settings';

export const getCountryCodeFromLS = () => {
  const countryCode = localStorageService.getData<string>(COUNTRY_CODE_LS_KEY);

  if (countryCode && countryCode in CountryCode) {
    return countryCode as CountryCode;
  }

  return CountryCode.US;
};

export const initialState = {
  countryCode: getCountryCodeFromLS(),
};

export const createAuthSlice = (initialState: TSettingsState, sliceName: string) =>
  createSlice({
    initialState,
    name: sliceName,
    reducers: {
      countryChanged(state, action: PayloadAction<CountryCode>) {
        const countryCode = action.payload;
        if (countryCode in CountryCode) {
          state.countryCode = countryCode;
          localStorageService.saveData(COUNTRY_CODE_LS_KEY, countryCode);
        }
      },
    },
  });

export const slice = createAuthSlice(initialState, SLICE_NAME);
export const selectLocale = (state: RootState) => CountryLocale[state[SLICE_NAME].countryCode];
export const selectCountryCode = (state: RootState) => state[SLICE_NAME].countryCode;
export const { countryChanged } = slice.actions;

export default slice.reducer;
