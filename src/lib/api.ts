import axios from "axios";
import { unwrapResponse } from "./api-types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

// Unwrap the backend envelope so `api.get<T>` resolves with `response.data: T`.
api.interceptors.response.use(unwrapResponse);

export default api;
