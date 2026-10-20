import { isAxiosError, type AxiosResponse } from "axios";

export type ApiSuccess<T, M = Record<string, never>> = {
  success: true;
  data: T;
  meta: { timestamp: string } & M;
};

export type ApiList<T> = ApiSuccess<Array<T>, { count: number }>;

export type ApiErrorBody = {
  success: false;
  statusCode: number;
  error: string;
  message: string | Array<string>;
  path: string;
  timestamp: string;
};

/** Extracts a user-facing message from an API error envelope. */
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<Partial<ApiErrorBody>>(error)) return fallback;
  if (!error.response) {
    return error.code === "ERR_NETWORK"
      ? "We could not reach the server. Check your connection and try again."
      : fallback;
  }
  // Only 4xx messages are written for users; 5xx bodies can leak internals.
  const { status, data } = error.response;
  if (status < 400 || status >= 500) return fallback;

  const message = data?.message;
  if (typeof message === "string" && message) return message;
  if (Array.isArray(message) && message.length) return message.join(", ");

  return fallback;
}

declare module "axios" {
  interface AxiosResponse {
    /** Envelope `meta` (timestamp, count, ...), set by the response interceptor. */
    meta?: ApiSuccess<unknown, Record<string, unknown>>["meta"];
  }
}

/**
 * Replaces `response.data` with the envelope payload and moves `meta` onto the
 * response. Rejects malformed bodies; empty bodies (e.g. 204) pass through.
 */
export function unwrapResponse(response: AxiosResponse): AxiosResponse {
  const body: unknown = response.data;
  if (response.status === 204 || body === "" || body === undefined) {
    return response;
  }
  if (
    typeof body !== "object" ||
    body === null ||
    (body as Partial<ApiSuccess<unknown>>).success !== true ||
    !("data" in body)
  ) {
    throw new Error("Received an unexpected response from the server.");
  }
  const envelope = body as ApiSuccess<unknown, Record<string, unknown>>;
  response.data = envelope.data;
  response.meta = envelope.meta;
  return response;
}
