import { useMemo } from 'react';

export type TUseQueryValueParams = {
  params: URLSearchParams;
  key: string;
  validator?: (key: string) => boolean;
};

export const useParamValue = ({ params, key, validator }: TUseQueryValueParams) => {
  const paramValue = params.get(key);

  const value = useMemo(() => {
    const trimmedParamValue = paramValue ? paramValue.trim() : null;

    if (!trimmedParamValue || (validator && !validator(trimmedParamValue))) {
      return null;
    }

    return trimmedParamValue;
  }, [paramValue, validator]);

  return value;
};
