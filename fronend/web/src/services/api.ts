import axios from "axios";

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
});

export const catalogApi = axios.create({
  baseURL: import.meta.env.VITE_CATALOG_SERVICE_URL,
});

export const orderApi = axios.create({
  baseURL: import.meta.env.VITE_ORDER_SERVICE_URL,
});
