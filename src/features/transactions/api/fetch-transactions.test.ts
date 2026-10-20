import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/lib/api";
import { transactionsQueryOptions } from "./fetch-transactions";
import { transactionSummaryQueryOptions } from "./fetch-transaction-summary.api";

vi.mock("@/lib/api", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe("transactions fetchers", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
  });

  it("fetches the transactions list", async () => {
    const rows = [{ id: "1" }];
    vi.mocked(api.get).mockResolvedValue({ data: rows });

    const data = await new QueryClient().ensureQueryData(
      transactionsQueryOptions({ type: "expense", search: "a" }),
    );

    expect(api.get).toHaveBeenCalledWith("/transactions", {
      params: { type: "expense", search: "a" },
    });
    expect(data).toEqual(rows);
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
