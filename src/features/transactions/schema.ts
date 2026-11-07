import * as z from "zod";
import { isValidMonth, monthFromLegacyRange } from "./month";
import type { TransactionFilters } from "./types";

// The API rejects longer title searches.
export const SEARCH_MAX_LENGTH = 100;

// Invalid params fall back to undefined instead of failing the route.
export const transactionFiltersSchema = z
  .object({
    type: z.enum(["income", "expense"]).optional().catch(undefined),
    // Trimmed and capped like the search input, so a long or blank value from
    // a shared URL never reaches the API.
    search: z
      .string()
      .trim()
      .transform((value) => value.slice(0, SEARCH_MAX_LENGTH) || undefined)
      .optional()
      .catch(undefined),
    month: z.string().refine(isValidMonth).optional().catch(undefined),
    // Legacy from/to links are mapped to their month, then dropped.
    from: z.unknown().optional(),
    to: z.unknown().optional(),
  })
  .transform(
    ({ from, to, ...filters }): TransactionFilters => ({
      ...filters,
      month: filters.month ?? monthFromLegacyRange(from, to),
    }),
  );

export const createTransactionFormSchema = z.object({
  title: z.string().trim().min(1, "Enter a title."),
  amount: z.coerce
    .number<string>("Enter an amount.")
    .min(0.01, "Amount must be greater than zero."),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().min(1, "Select a category."),
  date: z
    .string()
    .min(1, "Select a date.")
    // A calendar day, stored as UTC midnight (05:30 IST), so it falls on the
    // same day in IST, where dates are displayed and filtered.
    .transform((value) => new Date(`${value}T00:00:00Z`).toISOString()),
});

export type CreateTransactionFormInput = z.input<
  typeof createTransactionFormSchema
>;
export type CreateTransactionFormValues = z.output<
  typeof createTransactionFormSchema
>;
