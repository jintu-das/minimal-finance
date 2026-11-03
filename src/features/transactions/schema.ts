import * as z from "zod";

// The API rejects longer title searches.
export const SEARCH_MAX_LENGTH = 100;

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
