import { addMonths, format, isValid, parse } from "date-fns";
import type { TransactionFilters } from "./types";

// Months are "yyyy-MM" and days "yyyy-MM-dd" strings so they round-trip
// cleanly through the URL and go to the API unchanged. date-fns parses and
// formats them in local time, so the browser's timezone never shifts them.
const MONTH_FORMAT = "yyyy-MM";
const DAY_FORMAT = "yyyy-MM-dd";
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const DAY_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// Users are in India and the API buckets by IST, so instants are read in IST.
// Core date-fns has no timezone support, hence Intl here. en-CA formats as
// yyyy-MM-dd.
const istDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const parseMonth = (month: string) =>
  parse(month, MONTH_FORMAT, new Date());
export const parseDay = (day: string) => parse(day, DAY_FORMAT, new Date());
export const toDay = (date: Date) => format(date, DAY_FORMAT);

export function isValidMonth(value: unknown): value is string {
  return typeof value === "string" && MONTH_PATTERN.test(value);
}

// The pattern alone lets impossible days such as 2026-02-31 through.
export function isValidDay(value: unknown): value is string {
  return (
    typeof value === "string" &&
    DAY_PATTERN.test(value) &&
    isValid(parseDay(value))
  );
}

// The IST calendar day (yyyy-MM-dd) of an instant.
export function istDay(date: Date | string) {
  return istDate.format(new Date(date));
}

export function currentMonth(now = new Date()) {
  return istDay(now).slice(0, 7);
}

// Today's IST day as a local date, so calendars highlight the same "today"
// that the app's defaults and month filters use.
export function istToday(now = new Date()) {
  return parseDay(istDay(now));
}

// The `month` search param for a month: the current month is the default, so
// it is kept out of the URL.
export function monthSearchParam(month: string, thisMonth = currentMonth()) {
  return month === thisMonth ? undefined : month;
}

export function shiftMonth(month: string, amount: number) {
  return format(addMonths(parseMonth(month), amount), MONTH_FORMAT);
}

export function formatMonth(month: string) {
  return format(parseMonth(month), "MMMM yyyy");
}

export function formatDay(day: string) {
  return format(parseDay(day), "d MMM yyyy");
}

// The API rejects `month` combined with `from`/`to`, so a range always wins
// and the month defaults to the current IST month when neither is set.
export function resolveTransactionFilters({
  type,
  search,
  month,
  from,
  to,
}: TransactionFilters): TransactionFilters {
  const period =
    from || to ? { from, to } : { month: month ?? currentMonth() };
  // Undefined keys are left out of the query key hash and the request params.
  return { type, search, ...period };
}

// Heading label, e.g. "October 2026" or "1 Oct 2026 to 15 Oct 2026".
export function describePeriod({ month, from, to }: TransactionFilters) {
  if (month) return formatMonth(month);
  if (from && to) {
    return from === to
      ? formatDay(from)
      : `${formatDay(from)} to ${formatDay(to)}`;
  }
  if (from) return `From ${formatDay(from)}`;
  return to ? `Up to ${formatDay(to)}` : "";
}

// Mid-sentence form, e.g. "in October 2026" or "on 5 Oct 2026".
export function periodPhrase({ month, from, to }: TransactionFilters) {
  if (month) return `in ${formatMonth(month)}`;
  if (from && from === to) return `on ${formatDay(from)}`;
  const start = from ? `from ${formatDay(from)}` : "";
  const end = to ? `${from ? "to" : "up to"} ${formatDay(to)}` : "";
  return [start, end].filter(Boolean).join(" ");
}
