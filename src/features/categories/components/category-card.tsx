import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { Category } from "../types";

export default function CategoryCard(category: Category) {
  const progress =
    category.budget > 0
      ? Math.min((category.spent / category.budget) * 100, 100)
      : 0;

  return (
    <li className="py-3 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">{category.label}</h3>
        <span className="text-sm font-light ">
          {category.spent}/{category.budget}
        </span>
      </div>

      <Progress value={progress} className="*:data-[slot=progress-track]:h-0.5">
        <div className="order-1 flex w-full justify-between text-sm">
          <ProgressLabel className="text-muted-foreground">
            {category.transactionCount} records
          </ProgressLabel>
          <ProgressValue />
        </div>
      </Progress>
    </li>
  );
}
