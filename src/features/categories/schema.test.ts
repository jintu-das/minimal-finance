import { describe, expect, it } from "vitest";
import { createCategoryFormSchema } from "./schema";

const valid = { label: "Groceries", budget: "250", type: "expense" };

describe("createCategoryFormSchema", () => {
  it("accepts valid input and coerces budget to a number", () => {
    const result = createCategoryFormSchema.parse(valid);
    expect(result).toEqual({ label: "Groceries", budget: 250, type: "expense" });
  });

  it("trims the label", () => {
    const result = createCategoryFormSchema.parse({ ...valid, label: "  Rent  " });
    expect(result.label).toBe("Rent");
  });

  it("rejects an empty or whitespace-only label", () => {
    const result = createCategoryFormSchema.safeParse({ ...valid, label: "   " });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Enter a category name.");
  });

  it("rejects a label longer than 32 characters", () => {
    const result = createCategoryFormSchema.safeParse({ ...valid, label: "a".repeat(33) });
    expect(result.success).toBe(false);
  });

  it("accepts a zero budget", () => {
    expect(createCategoryFormSchema.parse({ ...valid, budget: "0" }).budget).toBe(0);
  });

  it("rejects a negative budget", () => {
    const result = createCategoryFormSchema.safeParse({ ...valid, budget: "-1" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Budget must be zero or more.");
  });

  it("rejects a non-numeric budget", () => {
    expect(createCategoryFormSchema.safeParse({ ...valid, budget: "abc" }).success).toBe(false);
  });

  it.each(["income", "expense"])("accepts type %s", (type) => {
    expect(createCategoryFormSchema.parse({ ...valid, type }).type).toBe(type);
  });

  it("rejects an unknown type", () => {
    expect(createCategoryFormSchema.safeParse({ ...valid, type: "transfer" }).success).toBe(false);
  });
});
