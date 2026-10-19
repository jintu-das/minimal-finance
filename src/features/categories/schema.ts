import * as z from "zod";

export const createCategoryFormSchema = z.object({
  label: z.string().trim().min(1, "Enter a category name.").max(32),
  budget: z.coerce.number<string>().min(0, "Budget must be zero or more."),
  type: z.enum(["income", "expense"]),
});

export const categoriesFiltersSchema = z.object({
  search: z
    .string()
    .trim()
    .max(100)
    .transform((value) => value || undefined)
    .optional()
    .catch(undefined),
});

export type CategoriesFilters = z.infer<typeof categoriesFiltersSchema>;

export type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;
