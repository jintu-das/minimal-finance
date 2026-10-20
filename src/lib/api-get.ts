import type { AxiosRequestConfig } from "axios";
import api from "./api";
import { unwrapEnvelope, type ApiSuccess } from "./api-types";

/** GET that returns the envelope payload. Use `api.get` directly when `meta` is needed. */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  return unwrapEnvelope(await api.get<ApiSuccess<T, object>>(url, config));
}
