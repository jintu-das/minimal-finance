export type Category = {
  budget: number;
  createdAt: string;
  id: string;
  label: string;
  type: "expense" | "income";
  updatedAt: string;
};

export type { CategoriesFilters } from "./schema";
