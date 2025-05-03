export type TGetQueryStringParams = Record<string, unknown>;

export const getQueryString = (obj?: TGetQueryStringParams) => {
  if (!obj) return;

  const result = new URLSearchParams();

  Object.entries(obj).forEach(([key, item]) => {
    if (Array.isArray(item)) {
      return item.forEach((value) => result.append(key, String(value)));
    }

    result.append(key, String(item));
  });

  return result.toString();
};
