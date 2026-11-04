import { describe, expect, it } from "vitest";
import { monthRanges, monthToDateRanges, percentChange } from "./date-range";

// Inputs and expectations are UTC instants, so the tests do not depend on the
// machine's timezone. IST midnight is 18:30 UTC the day before.
describe("monthToDateRanges", () => {
  it("covers month to date in IST and the same window last month", () => {
    const { current, previous } = monthToDateRanges(
      new Date("2026-10-22T10:00:00Z"),
    );

    expect(current).toEqual({
      from: "2026-09-30T18:30:00.000Z",
      to: "2026-10-22T18:30:00.000Z",
    });
    expect(previous).toEqual({
      from: "2026-08-31T18:30:00.000Z",
      to: "2026-09-22T18:30:00.000Z",
    });
  });

  it("compares the last day of a month against the full previous month", () => {
    const { previous } = monthToDateRanges(new Date("2026-10-31T09:00:00Z"));

    expect(previous).toEqual({
      from: "2026-08-31T18:30:00.000Z",
      to: "2026-09-30T18:30:00.000Z",
    });
  });

  it("uses the IST day when UTC is still on the previous month", () => {
    // 20:00 UTC on 31 Oct is 01:30 IST on 1 Nov.
    const { current } = monthToDateRanges(new Date("2026-10-31T20:00:00Z"));

    expect(current).toEqual({
      from: "2026-10-31T18:30:00.000Z",
      to: "2026-11-01T18:30:00.000Z",
    });
  });
});

describe("monthRanges", () => {
  const now = new Date("2026-10-22T10:00:00Z");

  it("uses month to date for the current month", () => {
    expect(monthRanges("2026-10", "2026-10", now)).toEqual(
      monthToDateRanges(now),
    );
  });

  it("compares a past month in full against the month before", () => {
    expect(monthRanges("2026-03", "2026-10", now)).toEqual({
      current: {
        from: "2026-02-28T18:30:00.000Z",
        to: "2026-03-31T18:30:00.000Z",
      },
      previous: {
        from: "2026-01-31T18:30:00.000Z",
        to: "2026-02-28T18:30:00.000Z",
      },
    });
  });

  it("crosses the year boundary", () => {
    const { previous } = monthRanges("2026-01", "2026-10", now);

    expect(previous.from).toBe("2025-11-30T18:30:00.000Z");
  });
});

describe("percentChange", () => {
  it("returns the rounded change", () => {
    expect(percentChange(110, 100)).toBe(10);
    expect(percentChange(50, 150)).toBe(-66.7);
  });

  it("measures against the magnitude of a negative baseline", () => {
    expect(percentChange(0, -100)).toBe(100);
  });

  it("returns null without a baseline", () => {
    expect(percentChange(100, 0)).toBeNull();
  });
});
