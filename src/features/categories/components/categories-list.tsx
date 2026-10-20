import type { Category } from "../types";
import CategoryCard from "./category-card";

export function CategoriesList({
  categories,
}: {
  categories: Array<Category>;
}) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-6">
      {categories?.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </ul>
  );
}
