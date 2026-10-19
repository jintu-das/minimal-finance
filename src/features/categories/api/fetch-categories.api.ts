import { queryOptions } from "@tanstack/react-query";
import api from "../../../lib/api";
import { categoriesKeys } from "../query-keys";
import type { CategoriesFilters, Category } from "../types";

async function fetchCategories({ search }: CategoriesFilters) {
  return api.get<Array<Category>>("/categories/as", {
    params: { search },
  });
}

export const categoriesQueryOptions = (filters: CategoriesFilters = {}) =>
  queryOptions({
    queryKey: categoriesKeys.list(filters),
    queryFn: () => fetchCategories(filters),
    select: (data) => data.data,
  });
