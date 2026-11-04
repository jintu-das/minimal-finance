import { TypeIcon } from "@/components/common/type-icon";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { Category } from "../types";
import { DeleteCategoryButton } from "./delete-category-button";

export default function CategoryCard(category: Category) {
  const hasTransactions = category.transactionCount > 0;
  const progress =
    category.budget > 0
      ? Math.min((category.spent / category.budget) * 100, 100)
      : 0;
  // Same threshold as the analytics budgets.
  const isNearLimit = category.type === "expense" && progress >= 90;

  return (
    <li>
      <Card size="sm" className="shadow-none ring-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TypeIcon
              type={category.type}
              className="size-6 [&_svg]:size-3.5"
            />
            {category.label}
          </CardTitle>
          <CardDescription>
            {category.spent}/{category.budget}
          </CardDescription>
          <CardAction>
            {!hasTransactions && <DeleteCategoryButton category={category} />}
          </CardAction>
        </CardHeader>
        <CardContent>
          <Progress
            value={progress}
            className={cn(
              "*:data-[slot=progress-track]:h-0.5",
              isNearLimit &&
                "[&_[data-slot=progress-indicator]]:bg-destructive",
            )}
          >
            <div className="order-1 flex w-full justify-between text-sm">
              <ProgressLabel className="text-muted-foreground">
                {category.transactionCount} records
              </ProgressLabel>
              <ProgressValue />
            </div>
          </Progress>
        </CardContent>
      </Card>
    </li>
  );
}
