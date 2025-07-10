import axios from 'axios';

const authURL = import.meta.env.VITE_CTP_AUTH_URL;

export const authClient = axios.create({
  baseURL: `${authURL}/oauth/`,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});
