import { Separator } from "@/components/ui/separator";
import { categoriesQueryOptions } from "@/features/categories/api/fetch-categories.api";
import { CategoriesHeader } from "@/features/categories/components/categories-header";
import { CategoriesList } from "@/features/categories/components/categories-list";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(categoriesQueryOptions),
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const categoriesQuery = useSuspenseQuery(categoriesQueryOptions);
  const categories = categoriesQuery.data;

  return (
    <main className="container mx-auto space-y-8 pt-8">
      <CategoriesHeader />
      <Separator />
      <CategoriesList categories={categories} />
    </main>
  );
}
