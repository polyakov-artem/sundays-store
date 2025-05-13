import { ChangeEvent } from 'react';
import { MIN_CONTROL_NAME_PREFIX, TRangeState } from '../components/shared/RangeSlider/RangeSlider';
import { TConvertToParamFn, TConvertToStateFn, TOnChangeFn } from '../hooks/useSynchronizedValue';

export const defaultInputOnChangeFn: TOnChangeFn<
  string,
  ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
> = (e) => e.target.value;

export const defaultInputConvertToParamFn: TConvertToParamFn<string> = (state) => state;

export const defaultInputConvertToStateFn: TConvertToStateFn<string> = (urlValue, defaultState) =>
  urlValue || defaultState;

export type TCheckboxState = Record<string, boolean>;

export const defaultCheckboxUpdateStateFn: TOnChangeFn<
  TCheckboxState,
  ChangeEvent<HTMLInputElement>
> = (e, prevState, defaultState) => {
  const checkboxValue = e.target.value;
  const nextState = { ...prevState };

  if (checkboxValue in defaultState) {
    nextState[checkboxValue] = !prevState[checkboxValue];
  }

  return nextState;
};

export const defaultCheckboxConvertToStateFn: TConvertToStateFn<TCheckboxState> = (
  urlValue,
  defaultState
) => {
  if (urlValue) {
    const state = { ...defaultState };
    urlValue
      .replaceAll('"', '')
      .split(',')
      .forEach((paramValue) => {
        if (paramValue in state) {
          state[paramValue] = true;
        }
      });
    return state;
  }

  return defaultState;
};

export const defaultCheckboxConvertToParamFn: TConvertToParamFn<TCheckboxState> = (state) => {
  return Object.entries(state)
    .reduce((result, [checkboxValue, isChecked]) => {
      if (isChecked) {
        result.push(`"${checkboxValue}"`);
      }
      return result;
    }, [] as string[])
    .join(',');
};

export const defaultRangeUpdateStateFn: TOnChangeFn<TRangeState, ChangeEvent<HTMLInputElement>> = (
  e,
  prevState,
  _defaultState
) => {
  const { name } = e.target;
  const nextState = { ...prevState };
  const controlValue = +e.target.value;
  const isMinControlValue = name.startsWith(MIN_CONTROL_NAME_PREFIX);

  if (!isFinite(controlValue)) {
    return prevState;
  }

  const currentMinValue = prevState.values[0];
  const currentMaxValue = prevState.values[1];

  nextState.values = isMinControlValue
    ? [Math.max(Math.min(controlValue, currentMaxValue), prevState.minValue), currentMaxValue]
    : [currentMinValue, Math.min(Math.max(controlValue, currentMinValue), prevState.maxValue)];

  return nextState;
};

export const createRangeConvertToStateFn =
  (urlValueParser: (str: string) => string[]): TConvertToStateFn<TRangeState> =>
  (str, defaultState) => {
    if (str) {
      const [strMinValue, strMaxValue] = urlValueParser(str);
      const { minValue, maxValue } = defaultState;

      const parsedMinValue = +strMinValue;
      const parsedMaxValue = +strMaxValue;

      let currentMinValue = !isFinite(parsedMinValue)
        ? minValue
        : parsedMinValue < minValue
          ? minValue
          : parsedMinValue > maxValue
            ? maxValue
            : parsedMinValue;

      let currentMaxValue = !isFinite(parsedMaxValue)
        ? maxValue
        : parsedMaxValue > maxValue
          ? maxValue
          : parsedMaxValue < minValue
            ? minValue
            : parsedMaxValue;

      if (currentMinValue > currentMaxValue) {
        currentMinValue = currentMaxValue;
      }

      if (currentMaxValue < currentMinValue) {
        currentMaxValue = currentMinValue;
      }

      const nextState = {
        ...defaultState,
        values: [currentMinValue, currentMaxValue],
      };

      return nextState;
    }

    return defaultState;
  };

export const createRangeConvertToParamFn =
  (stateConverter: (state: TRangeState) => string): TConvertToParamFn<TRangeState> =>
  (state) => {
    return stateConverter(state);
  };
