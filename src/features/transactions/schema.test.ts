import { describe, expect, it } from "vitest";
import { createTransactionFormSchema } from "./schema";

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
    expect(result.date).toBe(new Date("2026-10-17T00:00:00").toISOString());
  });

  it("trims the title and rejects a blank one", () => {
    expect(createTransactionFormSchema.parse({ ...valid, title: " Rent " }).title).toBe("Rent");
    expect(createTransactionFormSchema.safeParse({ ...valid, title: "  " }).success).toBe(false);
  });

  it.each(["0", "-5", "abc", ""])("rejects amount %j", (amount) => {
    expect(createTransactionFormSchema.safeParse({ ...valid, amount }).success).toBe(false);
  });

  it("requires a category and a date", () => {
    expect(createTransactionFormSchema.safeParse({ ...valid, categoryId: "" }).success).toBe(false);
    expect(createTransactionFormSchema.safeParse({ ...valid, date: "" }).success).toBe(false);
  });

  it("rejects an unknown type", () => {
    expect(createTransactionFormSchema.safeParse({ ...valid, type: "transfer" }).success).toBe(false);
  });
});
