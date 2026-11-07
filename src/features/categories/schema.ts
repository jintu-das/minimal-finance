import * as z from "zod";

export const createCategoryFormSchema = z.object({
  label: z.string().trim().min(1, "Enter a category name.").max(32),
  budget: z.coerce.number<string>().min(0, "Budget must be zero or more."),
  type: z.enum(["income", "expense"]),
});

// The API rejects longer name searches.
export const CATEGORY_SEARCH_MAX_LENGTH = 100;

export const categoriesFiltersSchema = z.object({
  // Trimmed and capped like the search input, so a long or blank value from
  // a shared URL never reaches the API.
  search: z
    .string()
    .trim()
    .transform(
      (value) => value.slice(0, CATEGORY_SEARCH_MAX_LENGTH) || undefined,
    )
    .optional()
    .catch(undefined),
});

export type CategoriesFilters = z.infer<typeof categoriesFiltersSchema>;

export type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;
