import { queryOptions, useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";
import type { Category } from "../types";

async function fetchCategories() {
  return api.get<Array<Category>>("/categories");
}

export function useFetchCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: fetchCategories,
  select: (data) => data.data,
});
