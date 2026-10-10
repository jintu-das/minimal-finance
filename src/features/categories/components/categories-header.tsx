import { Button } from "@/components/ui/button";

export function CategoriesHeader() {
  return (
    <header className="flex justify-between">
      <h1 className="text-3xl font-medium">Categories</h1>
      <Button variant="secondary">+ Category</Button>
    </header>
  );
}
