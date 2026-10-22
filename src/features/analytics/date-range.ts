import { addDays, startOfDay, startOfMonth, subMonths } from "date-fns";
import type { AnalyticsRange } from "./types";

// Month to date, plus the same window one month earlier for comparison.
// `to` is the start of tomorrow so today's transactions are included and the
// range (and its query key) stays stable for the whole day.
export function monthToDateRanges(now = new Date()): {
  current: AnalyticsRange;
  previous: AnalyticsRange;
} {
  const from = startOfMonth(now);
  const to = startOfDay(addDays(now, 1));

  return {
    current: { from: from.toISOString(), to: to.toISOString() },
    previous: {
      from: subMonths(from, 1).toISOString(),
      to: subMonths(to, 1).toISOString(),
    },
  };
}

// Percentage change rounded to one decimal, or null when there is no baseline.
export function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}
