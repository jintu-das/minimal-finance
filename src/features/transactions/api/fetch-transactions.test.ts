import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/lib/api";
import { transactionsQueryOptions } from "./fetch-transactions";
import { transactionSummaryQueryOptions } from "./fetch-transaction-summary.api";

vi.mock("@/lib/api", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

const meta = { timestamp: "2026-10-19T09:30:00.000Z" };

describe("transactions fetchers", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
  });

  it("unwraps the transactions list envelope", async () => {
    const rows = [{ id: "1" }];
    vi.mocked(api.get).mockResolvedValue({
      data: { success: true, data: rows, meta: { ...meta, count: 1 } },
    });

    const data = await new QueryClient().ensureQueryData(
      transactionsQueryOptions({ type: "expense", search: "a" }),
    );

    expect(api.get).toHaveBeenCalledWith("/transactions", {
      params: { type: "expense", search: "a" },
    });
    expect(data).toEqual(rows);
  });

  it("unwraps the summary envelope", async () => {
    const summary = { income: 1, expense: 2 };
    vi.mocked(api.get).mockResolvedValue({
      data: { success: true, data: summary, meta },
    });

    const data = await new QueryClient().ensureQueryData(
      transactionSummaryQueryOptions({ from: "a", to: "b" }),
    );

    expect(api.get).toHaveBeenCalledWith("/transactions/summary", {
      params: { from: "a", to: "b" },
    });
    expect(data).toEqual(summary);
  });

  it("errors when the body is not an envelope", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    await expect(
      new QueryClient().ensureQueryData(transactionsQueryOptions()),
    ).rejects.toThrow(/unexpected response/);
  });
});
