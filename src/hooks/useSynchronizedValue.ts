import { useCallback, useEffect, useMemo, useState } from 'react';

export type TUseSynchronizedValueParams<T, E> = {
  defaultState: T;
  params: URLSearchParams;
  urlParamName: string;
  updateStateFn: (event: E, defaultState: T, prevState: T) => T;
  convertToStateFn: (urlValue: string | null, defaultState: T) => T;
  convertToParamFn: (state: T) => string;
};

export const useSynchronizedValue = <T, E>({
  defaultState,
  params,
  urlParamName,
  updateStateFn,
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
      setState((prevState) => updateStateFn(e, defaultState, prevState));
    },
    [updateStateFn, defaultState]
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
