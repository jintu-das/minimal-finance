import type { Category } from "../types";
import CategoryCard from "./category-card";

export function CategoriesList({
  categories,
}: {
  categories: Array<Category>;
}) {
  console.log({ categories });
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-x-12 gap-y-4">
      {categories?.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </ul>
  );
}
