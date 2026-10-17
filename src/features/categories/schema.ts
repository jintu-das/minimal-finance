import * as z from "zod";

export const addCategoryformSchema = z.object({
  label: z.string().trim().min(1, "Enter a category name.").max(32),
  budget: z.coerce.number<string>().min(0, "Budget must be zero or more."),
  type: z.enum(["income", "expense"]),
});

export type AddCategoryFormValues = z.infer<typeof addCategoryformSchema>;
