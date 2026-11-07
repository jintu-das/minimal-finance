import { categoriesQueryOptions } from "@/features/categories/api/fetch-categories.api";
import { CategoriesFilter } from "@/features/categories/components/categories-filter";
import { CategoriesList } from "@/features/categories/components/categories-list";
import { CategoriesPageHeader } from "@/features/categories/components/categories-page-header";
import { CategoriesPageSkeleton } from "@/features/categories/components/categories-skeleton";
import { categoriesFiltersSchema } from "@/features/categories/schema";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue } from "react";

export const Route = createFileRoute("/categories")({
  validateSearch: categoriesFiltersSchema,
  loaderDeps: ({ search: { search } }) => ({ search }),
  // Only entering the page waits for the fetch (and shows the skeleton if it
  // is slow). A search on the page must not wait: the router would swap in
  // the skeleton after pendingMs and remount the filter, losing its input, so
  // RouteComponent keeps the previous list meanwhile.
  loader: async ({ context: { queryClient }, deps, cause }) => {
    const fetching = queryClient.ensureQueryData(categoriesQueryOptions(deps));
    if (cause !== "stay") await fetching;
    // A failure here reaches the error boundary through useSuspenseQuery.
    else fetching.catch(() => undefined);
  },
  pendingComponent: CategoriesPageSkeleton,
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { search } = Route.useSearch();
  // The new search suspends in the background, so the previous list stays on
  // screen, dimmed, until its results arrive.
  const deferredSearch = useDeferredValue(search);
  const isUpdating = search !== deferredSearch;
  const { data: categories } = useSuspenseQuery(
    categoriesQueryOptions({ search: deferredSearch }),
  );

  return (
    <main className="container mx-auto space-y-8 pt-8">
      <CategoriesPageHeader />
      <CategoriesFilter />
      <div
        className={cn(
          "transition-opacity",
          isUpdating && "pointer-events-none opacity-50",
        )}
        aria-busy={isUpdating}
      >
        <CategoriesList categories={categories} />
      </div>
    </main>
  );
}
