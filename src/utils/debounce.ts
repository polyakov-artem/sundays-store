export const debounce = <T extends (...args: unknown[]) => unknown>(fn: T, ms: number) => {
  let timer: NodeJS.Timeout | undefined;
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const thisContext = this;

  function debounced(...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(thisContext, args);
    }, ms);
  }

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced;
};
