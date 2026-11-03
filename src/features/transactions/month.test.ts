import { describe, expect, it } from "vitest";
import {
  currentMonth,
  filterByMonth,
  formatMonth,
  isValidMonth,
  shiftMonth,
  summarizeTransactions,
} from "./month";
import type { Transaction } from "./types";

const tx = (date: string, type: Transaction["type"], amount: number) =>
  ({ id: date, date, type, amount }) as Transaction;

describe("month helpers", () => {
  it("validates yyyy-MM strings", () => {
    expect(isValidMonth("2026-11")).toBe(true);
    expect(isValidMonth("2026-13")).toBe(false);
    expect(isValidMonth("2026-1")).toBe(false);
    expect(isValidMonth(202611)).toBe(false);
  });

  it("formats the current month", () => {
    expect(currentMonth(new Date(2026, 10, 3))).toBe("2026-11");
  });

  it("shifts across year boundaries", () => {
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
  });

  it("formats a month label", () => {
    expect(formatMonth("2026-11")).toBe("November 2026");
  });

  it("filters transactions by UTC month", () => {
    const rows = [
      tx("2026-10-31T23:30:00.000Z", "expense", 1),
      tx("2026-11-01T00:00:00.000Z", "expense", 2),
      tx("2026-11-30T12:00:00.000Z", "income", 3),
      tx("2026-12-01T00:00:00.000Z", "income", 4),
    ];
    expect(filterByMonth(rows, "2026-11").map((row) => row.amount)).toEqual([
      2, 3,
    ]);
  });

  it("summarizes inflow, outflow and net", () => {
    const rows = [
      tx("2026-11-01T00:00:00.000Z", "income", 500),
      tx("2026-11-02T00:00:00.000Z", "expense", 120),
      tx("2026-11-03T00:00:00.000Z", "expense", 80),
    ];
    expect(summarizeTransactions(rows)).toEqual({
      inflow: 500,
      outflow: 200,
      net: 300,
      inflowCount: 1,
      outflowCount: 2,
    });
  });
});
