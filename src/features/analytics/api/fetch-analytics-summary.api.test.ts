import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/lib/api";
import { analyticsSummaryQueryOptions } from "./fetch-analytics-summary.api";

vi.mock("@/lib/api", () => ({ default: { get: vi.fn() } }));

const range = { from: "2026-10-01T00:00:00Z", to: "2026-10-18T00:00:00Z" };

describe("analyticsSummaryQueryOptions", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
  });

  it("scopes the query key by range", () => {
    expect(analyticsSummaryQueryOptions(range).queryKey).toEqual([
      "analytics",
      "summary",
      range,
    ]);
  });

  it("fetches the summary for the range", async () => {
    const summary = {
      ...range,
      totalEarned: 100,
      totalSpent: 40,
      netPosition: 60,
    };
    vi.mocked(api.get).mockResolvedValue({ data: summary });

    const data = await new QueryClient().ensureQueryData(
      analyticsSummaryQueryOptions(range),
    );

    expect(api.get).toHaveBeenCalledWith("/analytics/summary", {
      params: range,
    });
    expect(data).toEqual(summary);
  });
});
