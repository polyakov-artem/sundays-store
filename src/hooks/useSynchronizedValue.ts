import { useCallback, useEffect, useMemo, useState } from 'react';

export type TOnChangeFn<T, E> = (event: E, prevState: T, defaultState: T) => T;

export type TConvertToStateFn<T> = (value: string | null | undefined, defaultState: T) => T;

export type TConvertToParamFn<T> = (state: T) => string;

export type TUseSynchronizedValueParams<T, E> = {
  defaultState: T;
  params: URLSearchParams;
  urlParamName: string;
  onChangeFn: TOnChangeFn<T, E>;
  convertToStateFn: TConvertToStateFn<T>;
  convertToParamFn: TConvertToParamFn<T>;
};

export const useSynchronizedValue = <T, E>({
  defaultState,
  params,
  urlParamName,
  onChangeFn,
  convertToStateFn,
  convertToParamFn,
}: TUseSynchronizedValueParams<T, E>) => {
  const urlValue = params.get(urlParamName);
  const [state, setState] = useState<T>(convertToStateFn(urlValue, defaultState));

  useEffect(() => {
    setState(convertToStateFn(urlValue, defaultState));
  }, [urlValue, convertToStateFn, defaultState]);

  const handleChange = useCallback(
    (e: E) => {
      setState((prevState) => onChangeFn(e, prevState, defaultState));
    },
    [onChangeFn, defaultState]
  );

  // nextUrlValue is undefined if the current converted state is equal to the URL value,
  // null if the URL parameter should be deleted, or a string if the URL parameter
  // should be changed.

  const nextUrlValue = useMemo(() => {
    const convertedToUrlValue = convertToParamFn(state);

    if (urlValue !== null && convertedToUrlValue === '') {
      return null;
    }

    if (urlValue === convertedToUrlValue) {
      return undefined;
    }

    return convertedToUrlValue;
  }, [convertToParamFn, urlValue, state]);

  return { state, urlValue, nextUrlValue, handleChange };
};
