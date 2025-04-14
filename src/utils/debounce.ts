export const debounce = <T extends (...args: unknown[]) => unknown>(fn: T, ms: number) => {
  let timer: NodeJS.Timeout;

  function debounced(...args: Parameters<T>) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  }

  return debounced;
};
