import { Separator } from "@/components/ui/separator";
import { categoriesQueryOptions } from "@/features/categories/api/fetch-categories.api";
import { CategoriesFilter } from "@/features/categories/components/categories-filter";
import { CategoriesHeader } from "@/features/categories/components/categories-header";
import { CategoriesList } from "@/features/categories/components/categories-list";
import { categoriesFiltersSchema } from "@/features/categories/schema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories")({
  validateSearch: categoriesFiltersSchema,
  loaderDeps: ({ search: { search } }) => ({ search }),
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(categoriesQueryOptions(deps)),
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { search } = Route.useSearch();
  const { data: categories } = useSuspenseQuery(
    categoriesQueryOptions({ search }),
  );

  return (
    <main className="container mx-auto space-y-8 pt-8">
      <CategoriesHeader />
      <Separator />
      <CategoriesFilter />
      <CategoriesList categories={categories} />
    </main>
  );
}
