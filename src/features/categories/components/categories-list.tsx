import type { Category } from "../types";
import CategoryCard from "./category-card";

// const categories = [
//   {
//     id: 1,
//     label: "Groceries",
//     spent: 300,
//     budget: 1000,
//     records: 30,
//   },
//   {
//     id: 2,
//     label: "Dining",
//     spent: 300,
//     budget: 1000,
//     records: 20,
//   },
//   {
//     id: 3,
//     label: "Travel & Commute",
//     spent: 300,
//     budget: 1000,
//     records: 30,
//   },
//   {
//     id: 4,
//     label: "Wellness & Health",
//     spent: 300,
//     budget: 1000,
//     records: 5,
//   },
//   {
//     id: 5,
//     label: "Shopping",
//     spent: 300,
//     budget: 1000,
//     records: 20,
//   },
// ];

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
