import classNames from 'classnames';
import { camelToKebabCase } from './camelToKebabCase';

export type TClassMods = Record<string, string | boolean | undefined>;

export const getModClass = (
  base: string,
  modKey: keyof TClassMods,
  modValue: TClassMods[keyof TClassMods]
) => {
  const typeOfValue = typeof modValue;

  if (typeOfValue !== 'string' && modValue !== true) {
    return '';
  }

  const isKeyInCamelCase = /([a-z])([A-Z])/.test(modKey);
  const key = isKeyInCamelCase ? camelToKebabCase(modKey) : modKey;

  if (typeOfValue === 'string') {
    return `${base}_${key}_${modValue}`;
  }

  return `${base}_${key}`;
};

export const getClasses = (base: string, mix?: string | null, mods?: TClassMods) => {
  let modsClasses: Array<string | undefined> = [];

  if (mods) {
    modsClasses = Object.entries(mods || {}).map(([modKey, modValue]) => {
      return getModClass(base, modKey, modValue);
    });
  }

  return classNames(base, ...modsClasses, mix);
};
