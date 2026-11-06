import { describe, expect, it } from "vitest";
import {
  currentMonth,
  formatMonth,
  isValidMonth,
  monthFromLegacyRange,
  istDay,
  periodPhrase,
  resolveTransactionFilters,
  shiftMonth,
} from "./month";

describe("month helpers", () => {
  it("validates yyyy-MM strings", () => {
    expect(isValidMonth("2026-11")).toBe(true);
    expect(isValidMonth("2026-13")).toBe(false);
    expect(isValidMonth("2026-1")).toBe(false);
    expect(isValidMonth(202611)).toBe(false);
  });

  it("reads an instant's calendar day in IST", () => {
    expect(istDay("2026-10-31T23:30:00Z")).toBe("2026-11-01");
    expect(istDay("2026-10-31T00:00:00Z")).toBe("2026-10-31");
  });

  it("reads the current month in IST", () => {
    // 19:00 UTC on 31 Oct is 00:30 IST on 1 Nov.
    expect(currentMonth(new Date("2026-10-31T19:00:00Z"))).toBe("2026-11");
    expect(currentMonth(new Date("2026-10-31T18:00:00Z"))).toBe("2026-10");
  });

  it("shifts across year boundaries", () => {
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
    expect(shiftMonth("2026-03", -14)).toBe("2025-01");
  });

  it("formats a month label", () => {
    expect(formatMonth("2026-11")).toBe("November 2026");
    expect(formatMonth("2026-01")).toBe("January 2026");
  });

  it("describes the selected month mid-sentence", () => {
    expect(periodPhrase("2026-10")).toBe("in October 2026");
  });
});

describe("resolveTransactionFilters", () => {
  it("defaults to the current IST month", () => {
    expect(resolveTransactionFilters({})).toEqual({ month: currentMonth() });
  });

  it("fills in the month the caller read", () => {
    expect(resolveTransactionFilters({}, "2026-10")).toEqual({
      month: "2026-10",
    });
  });

  it("keeps a requested month alongside other filters", () => {
    expect(
      resolveTransactionFilters({ month: "2026-09", type: "expense" }),
    ).toEqual({ month: "2026-09", type: "expense" });
  });
});

describe("monthFromLegacyRange", () => {
  it("opens an old range link on the month it started", () => {
    expect(monthFromLegacyRange("2026-08-01", "2026-09-15")).toBe("2026-08");
    expect(monthFromLegacyRange(undefined, "2026-09-15")).toBe("2026-09");
  });

  it("ignores missing or malformed days", () => {
    expect(monthFromLegacyRange(undefined, undefined)).toBeUndefined();
    expect(monthFromLegacyRange("2026-13-01", undefined)).toBeUndefined();
    expect(monthFromLegacyRange("2026-08", undefined)).toBeUndefined();
  });
});
