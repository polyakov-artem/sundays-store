export const STRINGIFY_ERROR_MESSAGE = 'Failed to convert data to JSON';
export const SAVE_DATA_ERROR_MESSAGE = 'Failed to save data to local storage';
export const PARSE_ERROR_MESSAGE = 'Failed to parse JSON data';

export type TLocalStorageService = typeof localStorageService;

const mode = import.meta.env.MODE;

export const localStorageService = {
  saveData<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      if (mode === 'development') {
        console.error(e);
      }
    }
  },

  getData<T>(key: string): T | null {
    const dataStr = localStorage.getItem(key);

    if (dataStr === null) {
      return dataStr;
    }

    try {
      return JSON.parse(dataStr) as T;
    } catch (e) {
      if (mode === 'development') {
        console.error(e);
      }
      return null;
    }
  },

  removeData(key: string) {
    localStorage.removeItem(key);
  },
};
