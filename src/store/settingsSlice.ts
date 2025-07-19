import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CountryCode } from '../types/types';
import { AppDispatch, RootState } from './store';
import { localStorageService } from '../services/localStorageService';
import { COUNTRY_CODE_LS_KEY, getCountryCodeFromLS, getLocale } from './settingsSliceUtils';
import i18n from '../utils/i18n/i18n';

export type TSettingsState = {
  countryCode: CountryCode;
};

export const SLICE_NAME = 'settings';

export const initialState = {
  countryCode: getCountryCodeFromLS(),
};

export const createSettingsSlice = (initialState: TSettingsState, sliceName: string) =>
  createSlice({
    initialState,
    name: sliceName,
    reducers: {
      countryChanged(state, action: PayloadAction<CountryCode>) {
        state.countryCode = action.payload;
      },
    },
  });

export const changeCountry = (countryCode: CountryCode) => (dispatch: AppDispatch) => {
  if (countryCode in CountryCode) {
    void i18n.changeLanguage(getLocale(countryCode));
    dispatch(countryChanged(countryCode));
    localStorageService.saveData(COUNTRY_CODE_LS_KEY, countryCode);
  }
};

export const slice = createSettingsSlice(initialState, SLICE_NAME);
export const selectLocale = (state: RootState) => getLocale(state[SLICE_NAME].countryCode);
export const selectCountryCode = (state: RootState) => state[SLICE_NAME].countryCode;
export const { countryChanged } = slice.actions;

export default slice.reducer;
