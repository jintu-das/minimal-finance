import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/lib/api";
import {
  buildTransactionParams,
  transactionsQueryOptions,
} from "./fetch-transactions";
import { transactionSummaryQueryOptions } from "./fetch-transaction-summary.api";

vi.mock("@/lib/api", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe("transactions fetchers", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
  });

  it("fetches the transactions list with its totals", async () => {
    const rows = [{ id: "1" }];
    const summary = { count: 1, inflow: 0, outflow: 42, net: -42 };
    vi.mocked(api.get).mockResolvedValue({
      data: rows,
      meta: { timestamp: "2026-11-03T16:47:20.607Z", ...summary },
    });

    const data = await new QueryClient().ensureQueryData(
      transactionsQueryOptions({
        month: "2026-10",
        type: "expense",
        search: "a",
      }),
    );

    const [url, config] = vi.mocked(api.get).mock.calls[0];
    expect(url).toBe("/transactions");
    expect(String(config?.params)).toBe("month=2026-10&type=expense&search=a");
    expect(data).toEqual({ transactions: rows, summary });
  });

  it("rejects a list response without totals", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [],
      meta: { timestamp: "2026-11-03T16:47:20.607Z", count: 0 },
    });

    await expect(
      new QueryClient().ensureQueryData(transactionsQueryOptions()),
    ).rejects.toThrow("unexpected response");
  });

  it("sends only keys that have values", () => {
    expect(
      buildTransactionParams({
        from: "2026-10-01",
        to: "2026-10-15",
        search: "",
        type: undefined,
      }).toString(),
    ).toBe("from=2026-10-01&to=2026-10-15");
    expect(buildTransactionParams({}).toString()).toBe("");
  });

  it("fetches the summary", async () => {
    const summary = { income: 1, expense: 2 };
    vi.mocked(api.get).mockResolvedValue({ data: summary });

    const data = await new QueryClient().ensureQueryData(
      transactionSummaryQueryOptions({ from: "a", to: "b" }),
    );

    expect(api.get).toHaveBeenCalledWith("/transactions/summary", {
      params: { from: "a", to: "b" },
    });
    expect(data).toEqual(summary);
  });
});
