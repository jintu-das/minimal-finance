import { describe, expect, it } from "vitest";
import {
  currentMonth,
  describePeriod,
  formatMonth,
  isValidDay,
  isValidMonth,
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

  it("validates yyyy-MM-dd strings", () => {
    expect(isValidDay("2026-10-05")).toBe(true);
    expect(isValidDay("2026-10-32")).toBe(false);
    expect(isValidDay("2026-10-05T10:00:00")).toBe(false);
    expect(isValidDay("2026-02-31")).toBe(false);
    expect(isValidDay("2028-02-29")).toBe(true);
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

  it("describes the selected period", () => {
    expect(describePeriod({ month: "2026-10" })).toBe("October 2026");
    expect(describePeriod({ from: "2026-10-01", to: "2026-10-15" })).toBe(
      "1 Oct 2026 to 15 Oct 2026",
    );
    expect(describePeriod({ from: "2026-10-05", to: "2026-10-05" })).toBe(
      "5 Oct 2026",
    );
    expect(periodPhrase({ month: "2026-10" })).toBe("in October 2026");
    expect(periodPhrase({ from: "2026-10-05", to: "2026-10-05" })).toBe(
      "on 5 Oct 2026",
    );
    expect(periodPhrase({ to: "2026-10-15" })).toBe("up to 15 Oct 2026");
  });
});

describe("resolveTransactionFilters", () => {
  it("defaults to the current IST month", () => {
    expect(resolveTransactionFilters({})).toEqual({ month: currentMonth() });
  });

  it("never combines a month with a range", () => {
    expect(
      resolveTransactionFilters({
        month: "2026-09",
        from: "2026-10-01",
        to: "2026-10-15",
        type: "expense",
      }),
    ).toEqual({ from: "2026-10-01", to: "2026-10-15", type: "expense" });
  });
});
