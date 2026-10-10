import { AddCategory } from "./add-category";

export function CategoriesHeader() {
  return (
    <header className="flex justify-between">
      <h1 className="text-3xl font-medium">Categories</h1>
      <AddCategory />
    </header>
  );
}
