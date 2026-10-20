import { queryOptions } from "@tanstack/react-query";
import api from "@/lib/api";
import { categoriesKeys } from "../query-keys";
import type { CategoriesFilters, Category } from "../types";

async function fetchCategories({ search }: CategoriesFilters) {
  const { data } = await api.get<Array<Category>>("/categories", {
    params: { search },
  });
  return data;
}

export const categoriesQueryOptions = (filters: CategoriesFilters = {}) =>
  queryOptions({
    queryKey: categoriesKeys.list(filters),
    queryFn: () => fetchCategories(filters),
  });
