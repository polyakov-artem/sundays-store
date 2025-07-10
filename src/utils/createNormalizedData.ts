import { TObjKey } from '../types/types';

type GetIdType<V> = V extends TObjKey ? (V extends infer R ? R : never) : never;

export type NormalizedData<T, V> = V extends TObjKey
  ? {
      ids: Array<GetIdType<V>>;
      entities: Record<GetIdType<V>, T>;
    }
  : never;

export const createNormalizedData = <T, K extends keyof T, V = T[K]>(
  items: T[],
  idProp: K
): NormalizedData<T, V> => {
  const result = {
    ids: [],
    entities: {},
  } as unknown as NormalizedData<T, V>;

  items.forEach((item) => {
    const id = item[idProp] as GetIdType<V>;
    result.ids.push(id);
    result.entities[id] = item;
  });

  return result;
};
