import { TagsIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Category } from "../types";
import CategoryCard from "./category-card";

export function CategoriesList({
  categories,
}: {
  categories: Array<Category>;
}) {
  if (categories.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TagsIcon />
          </EmptyMedia>
          <EmptyTitle>No Categories Found</EmptyTitle>
          <EmptyDescription>
            Try a different search, or create a new category.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </ul>
  );
}
