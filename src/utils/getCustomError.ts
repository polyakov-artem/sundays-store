import { getMsgFromAxiosError } from './getMsgFromAxiosError';

export const getCustomError = (error: unknown) => {
  return {
    status: (error as { status?: number })?.status,
    data: getMsgFromAxiosError(error),
  };
};
