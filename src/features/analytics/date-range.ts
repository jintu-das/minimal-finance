import { addDays, addMonths, startOfMonth, subMonths } from "date-fns";
import {
  istDay,
  parseDay,
  parseMonth,
  toDay,
} from "@/features/transactions/month";
import type { AnalyticsRange } from "./types";

type ComparisonRanges = { current: AnalyticsRange; previous: AnalyticsRange };

// The API buckets by IST, so range bounds are IST midnights whatever the
// browser's timezone. Dates are only used for calendar arithmetic here; each
// bound is turned into an instant from its yyyy-MM-dd day.
const istMidnight = (date: Date) =>
  new Date(`${toDay(date)}T00:00:00+05:30`).toISOString();

const toRanges = (from: Date, to: Date, previousFrom: Date, previousTo: Date) => ({
  current: { from: istMidnight(from), to: istMidnight(to) },
  previous: { from: istMidnight(previousFrom), to: istMidnight(previousTo) },
});

// Month to date in IST, plus the same window one month earlier for comparison.
// `to` is the start of tomorrow so today's transactions are included and the
// range (and its query key) stays stable for the whole day.
export function monthToDateRanges(now = new Date()): ComparisonRanges {
  const today = parseDay(istDay(now));
  const from = startOfMonth(today);
  const to = addDays(today, 1);

  return toRanges(from, to, subMonths(from, 1), subMonths(to, 1));
}

// The ranges for a "yyyy-MM" month: month to date for `thisMonth` (the current
// IST month), and otherwise the whole month against the whole month before it.
export function monthRanges(
  month: string,
  thisMonth: string,
  now = new Date(),
): ComparisonRanges {
  if (month === thisMonth) return monthToDateRanges(now);

  const from = parseMonth(month);
  return toRanges(from, addMonths(from, 1), subMonths(from, 1), from);
}

// Percentage change rounded to one decimal, or null when there is no baseline.
export function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}
