import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*', () => {
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Not found',
    });
  }),
];
