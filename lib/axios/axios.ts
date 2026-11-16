import axios, { AxiosResponse } from "axios";
import { AxiosError } from 'axios';
import '@tanstack/react-query';

const lichessApi = axios.create({
  baseURL: "https://explorer.lichess.ovh",
  headers: {
    "Content-Type": "application/json",
  },
});

export const djangoApi = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

djangoApi.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // Return JUST the nested data payload. 
    // Now, your queryFn will directly return your specific data shape!
    return response.data; 
  },
  (error: AxiosError) => {
    // You can handle global error logging here (e.g., Sentry, Toast notifications)
    if (error.response?.status === 401) {
      // e.g., trigger logout
    }
    return Promise.reject(error);
  }
);

declare module '@tanstack/react-query' {
  interface Register {
    // This globally types the `error` object in useQuery and useMutation
    defaultError: AxiosError;
  }
}

export default lichessApi;