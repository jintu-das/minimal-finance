import { addMonths, format, parse } from "date-fns";
import type { Transaction } from "./types";

// Months are "yyyy-MM" strings so they round-trip cleanly through the URL.
const MONTH_FORMAT = "yyyy-MM";
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isValidMonth(value: unknown): value is string {
  return typeof value === "string" && MONTH_PATTERN.test(value);
}

export function currentMonth(now = new Date()) {
  return format(now, MONTH_FORMAT);
}

export function shiftMonth(month: string, amount: number) {
  const date = parse(month, MONTH_FORMAT, new Date());
  return format(addMonths(date, amount), MONTH_FORMAT);
}

export function formatMonth(month: string) {
  return format(parse(month, MONTH_FORMAT, new Date()), "MMMM yyyy");
}

// Dates are displayed in UTC (see formatDate), so bucket them by UTC month too.
export function filterByMonth(transactions: Array<Transaction>, month: string) {
  return transactions.filter(
    (transaction) =>
      new Date(transaction.date).toISOString().slice(0, 7) === month,
  );
}

export function summarizeTransactions(transactions: Array<Transaction>) {
  let inflow = 0;
  let outflow = 0;
  let inflowCount = 0;
  for (const transaction of transactions) {
    if (transaction.type === "income") {
      inflow += transaction.amount;
      inflowCount += 1;
    } else outflow += transaction.amount;
  }
  return {
    inflow,
    outflow,
    net: inflow - outflow,
    inflowCount,
    outflowCount: transactions.length - inflowCount,
  };
}
