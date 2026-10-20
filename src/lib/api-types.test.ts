import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { getApiErrorMessage, unwrapResponse } from "./api-types";

const withResponse = (data: unknown, status = 400) =>
  new AxiosError("fail", "ERR_BAD_REQUEST", undefined, undefined, {
    data,
    status,
  } as never);

describe("getApiErrorMessage", () => {
  it("returns a string message from the envelope", () => {
    expect(
      getApiErrorMessage(
        withResponse({ message: "Resource already exists." }, 409),
        "x",
      ),
    ).toBe("Resource already exists.");
  });

  it("joins array messages", () => {
    expect(
      getApiErrorMessage(
        withResponse({ message: ["a is bad", "b is bad"] }),
        "x",
      ),
    ).toBe("a is bad, b is bad");
  });

  it("falls back for non-API errors or empty bodies", () => {
    expect(getApiErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
    expect(getApiErrorMessage(withResponse({}), "fallback")).toBe("fallback");
  });

  it("hides server messages from 5xx responses", () => {
    expect(
      getApiErrorMessage(
        withResponse({ message: "PrismaClientKnownRequestError ..." }, 500),
        "fallback",
      ),
    ).toBe("fallback");
  });

  it("reports an unreachable server only for network errors", () => {
    expect(
      getApiErrorMessage(new AxiosError("Network Error", "ERR_NETWORK"), "x"),
    ).toMatch(/could not reach the server/);
    expect(
      getApiErrorMessage(new AxiosError("canceled", "ERR_CANCELED"), "x"),
    ).toBe("x");
    expect(
      getApiErrorMessage(new AxiosError("timeout", "ECONNABORTED"), "x"),
    ).toBe("x");
  });
});

describe("unwrapResponse", () => {
  const response = (data: unknown, status = 200) => ({ data, status }) as never;

  it("moves the payload to data and meta onto the response", () => {
    const meta = { timestamp: "t", count: 2 };
    const result = unwrapResponse(
      response({ success: true, data: [1, 2], meta }),
    );
    expect(result.data).toEqual([1, 2]);
    expect(result.meta).toEqual(meta);
  });

  it("passes empty bodies through", () => {
    expect(unwrapResponse(response(undefined, 204)).data).toBeUndefined();
    expect(unwrapResponse(response("")).data).toBe("");
  });

  it("rejects bodies that are not an envelope", () => {
    expect(() => unwrapResponse(response([1, 2]))).toThrow(
      /unexpected response/,
    );
    expect(() => unwrapResponse(response("<html></html>"))).toThrow();
    expect(() => unwrapResponse(response({ success: true }))).toThrow();
  });
});
