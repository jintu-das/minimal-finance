import { describe, expect, it } from "vitest";
import { monthToDateRanges, percentChange } from "./date-range";

describe("monthToDateRanges", () => {
  it("covers month to date and the same window last month", () => {
    const { current, previous } = monthToDateRanges(
      new Date(2026, 9, 22, 15, 30),
    );

    expect(current).toEqual({
      from: new Date(2026, 9, 1).toISOString(),
      to: new Date(2026, 9, 23).toISOString(),
    });
    expect(previous).toEqual({
      from: new Date(2026, 8, 1).toISOString(),
      to: new Date(2026, 8, 23).toISOString(),
    });
  });

  it("compares the last day of a month against the full previous month", () => {
    const { previous } = monthToDateRanges(new Date(2026, 9, 31, 9));

    expect(previous).toEqual({
      from: new Date(2026, 8, 1).toISOString(),
      to: new Date(2026, 9, 1).toISOString(),
    });
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
