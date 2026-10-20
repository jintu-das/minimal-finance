import { queryOptions } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-get";
import { categoriesKeys } from "../query-keys";
import type { CategoriesFilters, Category } from "../types";

function fetchCategories({ search }: CategoriesFilters) {
  return apiGet<Array<Category>>("/categories", { params: { search } });
}

export const categoriesQueryOptions = (filters: CategoriesFilters = {}) =>
  queryOptions({
    queryKey: categoriesKeys.list(filters),
    queryFn: () => fetchCategories(filters),
  });
