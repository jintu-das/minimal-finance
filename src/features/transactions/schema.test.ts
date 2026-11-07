import { describe, expect, it } from "vitest";
import {
  createTransactionFormSchema,
  SEARCH_MAX_LENGTH,
  transactionFiltersSchema,
} from "./schema";

const valid = {
  title: "Weekly groceries",
  amount: "42.5",
  type: "expense",
  categoryId: "8f14e45f-ceea-467a-9575-1c6a1d2f3b4c",
  date: "2026-10-17",
};

describe("createTransactionFormSchema", () => {
  it("coerces amount and converts the date to an ISO timestamp", () => {
    const result = createTransactionFormSchema.parse(valid);
    expect(result.amount).toBe(42.5);
    expect(result.date).toBe("2026-10-17T00:00:00.000Z");
  });

  it("trims the title and rejects a blank one", () => {
    expect(
      createTransactionFormSchema.parse({ ...valid, title: " Rent " }).title,
    ).toBe("Rent");
    expect(
      createTransactionFormSchema.safeParse({ ...valid, title: "  " }).success,
    ).toBe(false);
  });

  it.each(["0", "-5", "abc", ""])("rejects amount %j", (amount) => {
    expect(
      createTransactionFormSchema.safeParse({ ...valid, amount }).success,
    ).toBe(false);
  });

  it("requires a category and a date", () => {
    expect(
      createTransactionFormSchema.safeParse({ ...valid, categoryId: "" })
        .success,
    ).toBe(false);
    expect(
      createTransactionFormSchema.safeParse({ ...valid, date: "" }).success,
    ).toBe(false);
  });

  it("rejects an unknown type", () => {
    expect(
      createTransactionFormSchema.safeParse({ ...valid, type: "transfer" })
        .success,
    ).toBe(false);
  });
});

describe("transactionFiltersSchema", () => {
  it("keeps valid filters", () => {
    expect(
      transactionFiltersSchema.parse({
        type: "income",
        search: " rent ",
        month: "2026-11",
      }),
    ).toEqual({ type: "income", search: "rent", month: "2026-11" });
  });

  it("drops invalid values instead of failing", () => {
    expect(
      transactionFiltersSchema.parse({
        type: "transfer",
        search: 42,
        month: "2026-13",
      }),
    ).toEqual({ type: undefined, search: undefined, month: undefined });
  });

  it("drops a blank search and caps a long one", () => {
    expect(transactionFiltersSchema.parse({ search: "   " }).search).toBe(
      undefined,
    );
    expect(
      transactionFiltersSchema.parse({ search: "a".repeat(150) }).search,
    ).toHaveLength(SEARCH_MAX_LENGTH);
  });

  it("maps a legacy from/to range to its month and drops the range", () => {
    expect(
      transactionFiltersSchema.parse({ from: "2026-10-01", to: "2026-10-31" }),
    ).toEqual({ month: "2026-10" });
  });

  it("prefers month over a legacy range", () => {
    expect(
      transactionFiltersSchema.parse({ month: "2026-11", from: "2026-10-01" })
        .month,
    ).toBe("2026-11");
  });
});
