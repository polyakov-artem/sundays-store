import { ChangeEvent } from 'react';

export const defaultInputUpdateStateFn = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => e.target.value;
export const defaultInputConvertToParamFn = (state: string) => state;

export const defaultInputConvertToStateFn = (urlValue: string | null, defaultState: string) =>
  urlValue || defaultState;

export type TCheckboxState = Record<string, boolean>;

export const defaultCheckboxUpdateStateFn = (
  e: ChangeEvent<HTMLInputElement>,
  defaultState: TCheckboxState,
  prevState: TCheckboxState
) => {
  const checkboxValue = e.target.value;
  const nextState = { ...prevState };

  if (checkboxValue in defaultState) {
    nextState[checkboxValue] = !prevState[checkboxValue];
  }

  return nextState;
};

export const defaultCheckboxConvertToStateFn = (
  urlValue: string | null,
  defaultState: TCheckboxState
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

export const defaultCheckboxConvertToParamFn = (state: TCheckboxState) => {
  return Object.entries(state)
    .reduce((result, [checkboxValue, isChecked]) => {
      if (isChecked) {
        result.push(`"${checkboxValue}"`);
      }
      return result;
    }, [] as string[])
    .join(',');
};
