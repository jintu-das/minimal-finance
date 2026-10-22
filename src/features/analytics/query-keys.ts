import type { AnalyticsRange } from "./types";

export const analyticsKeys = {
  all: ["analytics"] as const,
  summary: (range: AnalyticsRange) =>
    [...analyticsKeys.all, "summary", range] as const,
};
