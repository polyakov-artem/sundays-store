import { isObject } from './isObject';

export const isErrorWithCode = (code: number | string, error?: unknown) => {
  if (error && isObject(error) && 'status' in error && error.status === code) {
    return true;
  }

  return false;
};
