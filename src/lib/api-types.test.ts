import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { getApiErrorMessage, unwrapEnvelope } from "./api-types";

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

describe("unwrapEnvelope", () => {
  const wrap = (data: unknown) => ({ data }) as never;

  it("returns the envelope payload", () => {
    expect(
      unwrapEnvelope(wrap({ success: true, data: [1, 2], meta: {} })),
    ).toEqual([1, 2]);
  });

  it("rejects bodies that are not an envelope", () => {
    expect(() => unwrapEnvelope(wrap([1, 2]))).toThrow(/unexpected response/);
    expect(() => unwrapEnvelope(wrap("<html></html>"))).toThrow();
    expect(() => unwrapEnvelope(wrap(undefined))).toThrow();
    expect(() => unwrapEnvelope(wrap({ success: true }))).toThrow();
  });
});
