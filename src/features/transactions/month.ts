import { addMonths, format, parse } from "date-fns";
import type { TransactionFilters } from "./types";

// Months are "yyyy-MM" and days "yyyy-MM-dd" strings so they round-trip
// cleanly through the URL and go to the API unchanged. date-fns parses and
// formats them in local time, so the browser's timezone never shifts them.
const MONTH_FORMAT = "yyyy-MM";
const DAY_FORMAT = "yyyy-MM-dd";
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

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

// The month defaults to the current IST month when none is set. Callers that
// also show `thisMonth` pass the value they read, so the two always agree.
export function resolveTransactionFilters(
  { type, search, month }: TransactionFilters,
  thisMonth = currentMonth(),
): TransactionFilters & { month: string } {
  // Undefined keys are left out of the query key hash and the request params.
  return { type, search, month: month ?? thisMonth };
}

// Links shared before range filtering was removed carry `from`/`to` days
// (yyyy-MM-dd) instead of a month. They open on the month the range started.
export function monthFromLegacyRange(from: unknown, to: unknown) {
  const day = typeof from === "string" ? from : to;
  if (typeof day !== "string") return undefined;
  const month = day.slice(0, 7);
  return day.length === 10 && isValidMonth(month) ? month : undefined;
}

// Mid-sentence form, e.g. "in October 2026".
export function periodPhrase(month: string) {
  return `in ${formatMonth(month)}`;
}
