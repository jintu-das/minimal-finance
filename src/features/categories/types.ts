export type Category = {
  budget: number;
  createdAt: string;
  id: string;
  label: string;
  type: "expense" | "income";
  updatedAt: string;
  spent: number;
  transactionCount: number;
};

export type { CategoriesFilters } from "./schema";
