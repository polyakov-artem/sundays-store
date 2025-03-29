export const delay = (time?: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, time);
  });
};
