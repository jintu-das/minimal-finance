import { isAxiosError } from "axios";

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

/** Unwraps the `data` payload of an axios response, rejecting malformed envelopes. */
export function unwrapEnvelope<T>(response: {
  data: ApiSuccess<T, object>;
}): T {
  const body = response.data as Partial<ApiSuccess<T>> | undefined;
  if (!body || body.success !== true || body.data === undefined) {
    throw new Error("Received an unexpected response from the server.");
  }
  return body.data;
}
