import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { Category } from "../types";

// replace with actual values later
const CATEGORY_SPENT = 100;
const CATEGORY_RECORDS = 6;

export default function CategoryCard(category: Category) {
  const progress =
    category.budget > 0
      ? Math.min((CATEGORY_SPENT / category.budget) * 100, 100)
      : 0;

  return (
    <li className="py-3 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">{category.label}</h3>
        <span className="text-sm font-light ">
          {CATEGORY_SPENT}/{category.budget}
        </span>
      </div>

      <Progress value={progress} className="*:data-[slot=progress-track]:h-0.5">
        <div className="order-1 flex w-full justify-between text-sm">
          <ProgressLabel className="text-muted-foreground">
            {CATEGORY_RECORDS} records
          </ProgressLabel>
          <ProgressValue />
        </div>
      </Progress>
    </li>
  );
}
