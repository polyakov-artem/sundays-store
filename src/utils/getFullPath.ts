import { PUBLIC_PATH } from '../constants/constants';

export const getFullPath = (...args: string[]): string => PUBLIC_PATH + args.join('/');
