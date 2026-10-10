import { Separator } from "@/components/ui/separator";
import { CategoriesHeader } from "@/features/categories/components/categories-header";
import { CategoriesList } from "@/features/categories/components/categories-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  return (
    <main className="container mx-auto space-y-8 pt-8">
      <CategoriesHeader />
      <Separator />
      <CategoriesList />
    </main>
  );
}
