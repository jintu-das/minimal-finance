import api from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { analyticsKeys } from "../query-keys";
import type { AnalyticsRange, AnalyticsSummary } from "../types";

async function fetchAnalyticsSummary({ from, to }: AnalyticsRange) {
  const { data } = await api.get<AnalyticsSummary>("/analytics/summary", {
    params: { from, to },
  });
  return data;
}

export const analyticsSummaryQueryOptions = (range: AnalyticsRange) =>
  queryOptions({
    queryKey: analyticsKeys.summary(range),
    queryFn: () => fetchAnalyticsSummary(range),
  });
