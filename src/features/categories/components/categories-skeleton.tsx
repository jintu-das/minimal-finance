import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesPageHeader } from "./categories-page-header";

const CARD_COUNT = 6;

// Mirrors CategoryCard: icon and label, spent/budget, then the progress row.
function CategoryCardSkeleton() {
  return (
    <li>
      <Card size="sm" className="shadow-none ring-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 shrink-0" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-0.5 w-full" />
        </CardContent>
      </Card>
    </li>
  );
}

// Route pending page for "/categories", shown while the first load of the
// categories is in flight. Matches the layout of the loaded page.
export function CategoriesPageSkeleton() {
  return (
    <main className="container mx-auto space-y-8 pt-8" aria-busy="true">
      <span className="sr-only" role="status">
        Loading categories
      </span>
      <CategoriesPageHeader />
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-full max-w-xs" />
        <Skeleton className="size-9 shrink-0" />
      </div>
      <ul className="grid grid-flow-row grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </ul>
    </main>
  );
}
