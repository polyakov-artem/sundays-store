import { TObj } from '../types/types';

export const isObject = (value: unknown): value is TObj => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
};
