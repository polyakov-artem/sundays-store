import axios, { AxiosError, AxiosResponse } from 'axios';

type TErrorResponse = {
  message: string;
};

export const REQUEST_ERROR_MESSAGES: Record<string, string> = {
  [AxiosError.ERR_BAD_OPTION_VALUE]: 'В запросе указано недопустимое значение',
  [AxiosError.ERR_BAD_OPTION]: 'В запросе указана недопустимая опция',
  [AxiosError.ECONNABORTED]: 'Превышение времени ожидания',
  [AxiosError.ETIMEDOUT]: 'Превышения лимита времени',
  [AxiosError.ERR_NETWORK]: 'Ошибка соединения с сервером',
  [AxiosError.ERR_FR_TOO_MANY_REDIRECTS]:
    'Превышено максимальное количество перенаправлений запроса',
  [AxiosError.ERR_DEPRECATED]: 'Использован устаревший метод запроса',
  [AxiosError.ERR_BAD_RESPONSE]:
    'Ответ сервера не может быть правильно проанализирован или имеет неожиданный формат',
  [AxiosError.ERR_BAD_REQUEST]:
    'Запрошенный файл имеет неожиданный формат или отсутствуют обязательные параметры',
  [AxiosError.ERR_CANCELED]: 'Запрос отменен пользователем',
  [AxiosError.ERR_NOT_SUPPORT]: 'Функция или метод не поддерживается',
  [AxiosError.ERR_INVALID_URL]: 'Указан неверный URL',
};

export const DEFAULT_RESPONSE_ERROR_MESSAGE = `Произошла ошибка на стороне сервера`;
export const DEFAULT_REQUEST_ERROR_MESSAGE = 'Не удалось получить ответ от сервера';
export const DEFAULT_CLIENT_ERROR_MESSAGE = `Произошла ошибка на стороне клиента`;
export const DEFAULT_SENDING_ERROR_MESSAGE = `Не удалось отправить запрос`;

export const getMsgFromAxiosError = (error: unknown): string => {
  let message = '';

  if (axios.isAxiosError<TErrorResponse>(error)) {
    if (error?.response) {
      message = getResponseError(error.response, error.message);
    } else if (error?.request) {
      message = getRequestError(error.code);
    } else {
      message = DEFAULT_SENDING_ERROR_MESSAGE;
    }
  } else {
    message = DEFAULT_CLIENT_ERROR_MESSAGE;
  }

  return message;
};

export const getResponseError = (
  response: AxiosResponse<TErrorResponse>,
  message: string
): string => {
  const dataMessage = response.data?.message;

  return dataMessage ? dataMessage : message ? message : DEFAULT_RESPONSE_ERROR_MESSAGE;
};

export const getRequestError = (code?: string) => {
  if (code) {
    const errorMessage = REQUEST_ERROR_MESSAGES[code];
    if (errorMessage) {
      return errorMessage;
    }
  }

  return DEFAULT_REQUEST_ERROR_MESSAGE;
};
